/**
 * Engineering Lab content. Every line is drawn from the three project repositories (ADRs, READMEs, status docs,
 * firmware sources) or from the case-study pages on this site. Nothing here is invented.
 * - ParkinSense: github.com/sudo-pranshu/ParkinSense (docs/decisions, docs/architecture, firmware)
 * - TremoSense: github.com/rkt-1597/TremoSense-Project (README, tremosense-app sources, MATLAB_Simulink)
 * - CircuitVision: github.com/sudo-pranshu/CircuitVision (EXPERIMENTS.md, docs/PROJECT_STATUS.md, results/)
 */

export type Status = 'built' | 'partly' | 'planned' | 'not-built'

export type Stage = {
  id: string
  name: string
  short: string
  status: Status
  purpose: string
  inputs: string[]
  outputs: string[]
  facts: [string, string][]
}

export const statusLabel: Record<Status, string> = {
  built: 'Implemented',
  partly: 'Implemented, hardware test pending',
  planned: 'Planned',
  'not-built': 'Not part of this system',
}

export const parkinsenseStages: Stage[] = [
  {
    id: 'hardware',
    name: 'Sensors and hardware',
    short: 'XIAO nRF52840 Sense · LSM6DS3 · MAX30102',
    status: 'built',
    purpose: 'Put a 6-axis IMU and a red + IR pulse sensor on one wrist-worn board, with the radio on the same chip.',
    inputs: ['Wrist motion', 'Reflected red and IR light'],
    outputs: ['Raw accelerometer and gyroscope samples', 'Raw PPG samples'],
    facts: [
      ['MCU', 'Seeed XIAO nRF52840 Sense, Cortex-M4F, BLE 5'],
      ['IMU', 'LSM6DS3 over I²C'],
      ['PPG', 'MAX30102, red + IR'],
      ['Enclosure', '3D-printed, on an elastic strap'],
    ],
  },
  {
    id: 'acquisition',
    name: 'IMU data acquisition',
    short: '104 Hz, ±4 g, ±500 dps',
    status: 'built',
    purpose: 'Sample motion at a rate that resolves the 3.5–7.5 Hz tremor band with room to spare, and keep it synchronised with the pulse stream.',
    inputs: ['IMU registers'],
    outputs: ['Timestamped 6-axis samples at 104 Hz'],
    facts: [
      ['IMU output rate', '104 Hz'],
      ['Ranges (firmware 5.0.0)', '±4 g, ±500 dps'],
      ['PPG FIFO', '100 samples per second'],
      ['Design choice', 'One synchronised stream for motion and pulse'],
    ],
  },
  {
    id: 'firmware',
    name: 'Embedded firmware',
    short: 'Acquire, timestamp, pack. Nothing else.',
    status: 'partly',
    purpose: 'Keep the device simple: no analysis on the wrist. Every sample is timestamped and numbered so the host can detect loss.',
    inputs: ['Sensor reads'],
    outputs: ['Packed, sequence-numbered packets'],
    facts: [
      ['Firmware v4', 'Hardware-verified build used for data collection'],
      ['Firmware 5.0.0', 'Adds protocol v2 and sensor settings applied before start-up; written and tested on the host, waiting on a hardware test procedure'],
    ],
  },
  {
    id: 'ble',
    name: 'BLE communication and streaming',
    short: '208-byte packets, 10 samples each',
    status: 'built',
    purpose: 'Stream samples to a host in fixed packets that carry enough metadata to measure the link itself.',
    inputs: ['Packed samples'],
    outputs: ['Decoded samples, device rate, packet loss, gaps'],
    facts: [
      ['Packet', '208 bytes: 8-byte header (version, flags, sequence, time) + 10 × 20-byte samples'],
      ['Integrity', 'Sequence numbers for loss, timestamp gap detection, measured device rate'],
      ['Protocol v2 flags', 'Clipping and dropped notifications'],
    ],
  },
  {
    id: 'preprocessing',
    name: 'Signal preprocessing and filtering',
    short: '4 s windows every 0.5 s, on device time',
    status: 'built',
    purpose: 'Cut the stream into overlapping analysis windows and prepare each one for its analysis, without destroying the tremor band.',
    inputs: ['Decoded samples'],
    outputs: ['4 s windows, one every 0.5 s'],
    facts: [
      ['Tremor spectrum', 'Computed on the mean-removed raw gyroscope. An earlier version band-passed first, which made the tremor-band ratio close to 1 for almost any input'],
      ['Arm movement', '0.5–3 Hz band-pass, central half of the window'],
      ['Heart rate', '0.5–4.5 Hz band-pass'],
      ['Time base', 'Thresholds are in device seconds, not call counts, so replay gives the live answer'],
    ],
  },
  {
    id: 'tremor',
    name: 'Tremor frequency and amplitude analysis',
    short: 'Welch PSD, peak in 3.5–7.5 Hz',
    status: 'built',
    purpose: 'Find the dominant rhythm in the tremor band, report its frequency and size, and reject look-alikes.',
    inputs: ['Raw gyroscope window'],
    outputs: ['Peak frequency (Hz)', 'Amplitude (deg/s RMS)', 'Per-window evidence'],
    facts: [
      ['Spectrum', 'One Welch PSD per gyro axis: 2 s Hann segments, 50 % overlap, nfft 1024; axes summed'],
      ['Peak', '3.5–7.5 Hz, Gaussian interpolation'],
      ['Amplitude', '√ power within ±0.625 Hz of the peak'],
      ['Rejection', 'SNR, band edge, arm-swing harmonic'],
    ],
  },
  {
    id: 'biomarkers',
    name: 'Digital biomarker extraction',
    short: 'Evidence score → HMM → tremor state',
    status: 'built',
    purpose: 'Turn per-window evidence into a stable tremor state, plus heart rate, HRV and steps, each tagged with a quality state.',
    inputs: ['Per-window evidence', 'PPG window', 'Motion context'],
    outputs: ['Tremor state and probability', 'Heart rate, HRV', 'Steps', 'Quality badges'],
    facts: [
      ['Tremor state', '2-state HMM forward filter over per-window evidence; not a trained classifier, because there is no labelled patient data'],
      ['Heart', 'Peak detection with dicrotic-notch guard; RMSSD, SDNN, pNN50, withheld below a 25 Hz effective PPG rate'],
      ['Steps', 'Adaptive-threshold peaks with a motion gate and a tremor guard'],
      ['Session biomarkers', 'Tremor time and tremor power, following the ParaDigMa definitions'],
    ],
  },
  {
    id: 'output',
    name: 'Analytical output and visualisation',
    short: 'FastAPI runtime · Dash dashboard · replay',
    status: 'built',
    purpose: 'Make every number inspectable and reproducible: live or replayed, with the versions that produced it recorded alongside.',
    inputs: ['Biomarkers, quality states'],
    outputs: ['Live dashboard', 'Recordings: every raw sample plus 79 window columns', 'Metadata with firmware, protocol and pipeline versions'],
    facts: [
      ['Runtime', 'FastAPI for acquisition, analysis and recording'],
      ['Dashboard', 'Plotly Dash, reads the metrics endpoint, never imports the pipeline'],
      ['Replay', 'Deterministic: a recorded session reproduces bit-exactly'],
      ['Speed', 'About 26× real time on a laptop; median analysis latency 17.8 ms'],
    ],
  },
]

export const tremosenseStages: Stage[] = [
  {
    id: 'sensing',
    name: 'Sensor and data acquisition',
    short: 'LSM6DS3TR-C at 208 Hz',
    status: 'built',
    purpose: 'Read the spoon handle’s motion with the IMU on the XIAO nRF52840 Sense, triggered by the sensor’s own data-ready signal.',
    inputs: ['Hand and gimbal motion'],
    outputs: ['Gyroscope and accelerometer samples at 208 Hz'],
    facts: [
      ['Board', 'XIAO nRF52840 Sense, Cortex-M4F'],
      ['IMU', 'LSM6DS3TR-C, 208 Hz output rate'],
      ['Trigger', 'Data-ready interrupt releases a semaphore'],
      ['RTOS', 'Zephyr: a high-priority IMU thread and a lower-priority servo thread'],
    ],
  },
  {
    id: 'calibration',
    name: 'Boot-time calibration',
    short: '300 samples over 3 s',
    status: 'built',
    purpose: 'Hold the board level at power-up and measure the IMU offsets so the estimator starts from a clean zero.',
    inputs: ['Raw samples while level'],
    outputs: ['Offsets'],
    facts: [
      ['Procedure', 'Blue LED on for three seconds, then blinks while offsets are logged, then the servos take over'],
      ['Samples', '300, enabled in the board config'],
    ],
  },
  {
    id: 'estimation',
    name: 'Noise handling and state estimation',
    short: '2-state EKF on roll and pitch',
    status: 'built',
    purpose: 'Fuse a drifting-but-smooth gyroscope with a noisy-but-absolute accelerometer into one roll and pitch estimate.',
    inputs: ['Gyroscope', 'Accelerometer', 'Offsets'],
    outputs: ['Roll and pitch estimate'],
    facts: [
      ['Predict', 'Gyroscope integrates the rotation since the last sample'],
      ['Correct', 'Accelerometer, against gravity'],
      ['Timing', 'Uses the measured time between samples, not a fixed step'],
      ['Guard', 'Pitch is clamped away from ±90°, where the Euler-angle maths breaks down'],
    ],
  },
  {
    id: 'control',
    name: 'Control',
    short: 'LQR gain K, 2 × 4',
    status: 'built',
    purpose: 'Turn the estimated state into one command per servo. The state includes both axes, so each can respond to motion on the other.',
    inputs: ['Roll, roll rate, pitch, pitch rate'],
    outputs: ['One command per servo'],
    facts: [
      ['Law', 'u = −K·x'],
      ['Gain', 'Solved from the algebraic Riccati equation in MATLAB (LQR_ARE.m) with the rig’s parameters'],
      ['Public repo', 'constants.h is a template: K and the noise covariances are set per rig'],
    ],
  },
  {
    id: 'actuation',
    name: 'Actuation',
    short: 'Two servos, every 10 ms',
    status: 'built',
    purpose: 'Counter-rotate the spoon head. Results go through a message queue so sensing never waits on actuation.',
    inputs: ['Servo commands'],
    outputs: ['Servo pulses at a 50 Hz frame'],
    facts: [
      ['Roll', 'MG995, 722–2278 µs pulse'],
      ['Pitch', 'FS90MG, 900–2100 µs pulse'],
      ['Command rate', '10 ms, servo thread drains the queue'],
    ],
  },
  {
    id: 'results',
    name: 'Experimental results',
    short: 'MATLAB / Simulink at 1000 Hz',
    status: 'partly',
    purpose: 'Validate the EKF and LQR design before and alongside the build, with cross-coupling between axes in every test.',
    inputs: ['Tremor input, 2–7° amplitude, frequency sweep'],
    outputs: ['Frequency-response plots', 'Residual motion'],
    facts: [
      ['Roll', '> 90 % suppression across most of 3–7 Hz (Simulink)'],
      ['Pitch', '> 80 % suppression across most of 3–7 Hz (Simulink)'],
      ['Residual RMS', '0.346° roll, 0.573° pitch, for 8° at 8 Hz (Simulink)'],
      ['Hardware', 'Quantitative benchmarking on the rig is on the team’s future-work list. The bench video shows the mechanism working.'],
    ],
  },
  {
    id: 'analysis',
    name: 'Tremor analysis and classification',
    short: 'Not built',
    status: 'not-built',
    purpose: 'Identifying tremor frequency and amplitude, or classifying tremor, is a stated objective of the project but has no module in the firmware. TremoSense stabilises; it does not diagnose or classify.',
    inputs: [],
    outputs: [],
    facts: [['Where tremor analysis lives', 'In ParkinSense, which measures tremor frequency and amplitude']],
  },
]

export type Decision = { h: string; items: string[] }

export const parkinsenseDecisions: Decision[] = [
  { h: 'The engineering problem', items: ['Tremor wearables usually watch one signal, offline. The aim: detect rest tremor in real time from motion and pulse together, measure its frequency and amplitude, and tag every output with how much to trust it.'] },
  {
    h: 'Approaches considered',
    items: [
      'Band-pass the signal before analysis (version 2.2). Measured to make the tremor-band ratio close to 1 for almost any input.',
      'Counter-based state machine for tremor state, in hop counts. Replaced by a probabilistic filter.',
      'A trained tremor classifier. Ruled out: there is no labelled patient data to train one honestly.',
      'A periodicity-gated step-counter rewrite. Cut false steps in arm movement on generated data but counted 13–43 steps on the one real walking recording, against 75 for the original.',
    ],
  },
  {
    h: 'Technical decisions',
    items: [
      'Welch spectrum on the raw, mean-removed gyroscope; peak in 3.5–7.5 Hz.',
      'Two-state HMM forward filter publishes the tremor state, with a probability.',
      'Every temporal threshold in device seconds, so replay at 26× speed gives the live answer.',
      'Keep the original step counter; keep the rewrite as an experimental option.',
    ],
  },
  {
    h: 'Challenges and how they were addressed',
    items: [
      'Strong tremor was being vetoed by its own acceleration: 120–250 deg/s rest tremor was published as TREMOR in 38 % of analyses. Motion context now uses 0.2–3 Hz content only; strong-tremor detection went from 38 % to 97 % on the generated benchmark.',
      'False steps during rest tremor: 23.3 per minute down to 0.3, by withholding the moving gate while rest tremor is confirmed.',
      'An early walking model lacked a physical term and made the original step counter look 82 % wrong. The model was corrected before any decision was taken.',
    ],
  },
  {
    h: 'Testing and validation',
    items: [
      'Byte-identical BLE packets from generated signals with known ground truth: 16 seeds × 30 s per tremor scenario, pipeline 2.2.0 against 3.0.0.',
      'Median tremor-frequency error 0.090 → 0.024 Hz.',
      '84 tests in CI, including golden regression on real recordings and a deterministic-replay check.',
    ],
  },
  {
    h: 'Current limitations',
    items: [
      'Not clinically validated, and not tested on labelled patient data. The benchmarks are engineering benchmarks.',
      'Onset latency is about 6 s, up from about 1 s: the price for no false calls on fast oscillation.',
      'Everyday arm movement still produces false steps (90 on the real normal-motion recording).',
      'Firmware 5.0.0 has not yet been through its hardware tests.',
    ],
  },
  {
    h: 'Future improvements',
    items: ['Labelled tremor data (PD@Home or a video-annotated cohort).', 'A chest-strap ECG for heart rate and HRV, and a clinical-grade reference oximeter for SpO₂.', 'Flash firmware 5.0.0 through its hardware tests.'],
  },
]

export const tremosenseDecisions: Decision[] = [
  { h: 'The engineering problem', items: ['Tremor in the 3–7 Hz range makes holding a spoon steady hard. The aim: a two-axis gimbal that measures the handle’s motion and counter-rotates the spoon head against it in real time.'] },
  {
    h: 'Approaches considered',
    items: [
      'An earlier design documented in the AVERRA plan: Arduino framework with a single loop at 100 Hz, a 4-state EKF with gyro-bias tracking, and 2 × MG92B servos.',
      'The repository build: Zephyr RTOS with two threads, IMU data-ready at 208 Hz, a 2-state EKF, and higher-torque MG995 and FS90MG servos.',
    ],
  },
  {
    h: 'Technical decisions',
    items: [
      'Sensing never waits on actuation: a high-priority thread reads, estimates and controls; a lower-priority thread drains a message queue every 10 ms.',
      'A 2 × 4 LQR gain over roll, roll rate, pitch and pitch rate, so each axis responds to the other.',
      'Gain solved from the algebraic Riccati equation in MATLAB with the rig’s physical parameters.',
      'The EKF uses measured sample timing and clamps pitch away from ±90°.',
    ],
  },
  {
    h: 'Challenges and how they were addressed',
    items: [
      'Starting from a clean zero: the board is held level for three seconds at power-up while 300 samples set the IMU offsets, signalled by the blue LED.',
      'Coupling between axes: cross-coupling is included in every Simulink test, with roll and yaw tremor held at 8° and 8 Hz while the pitch sweep runs.',
    ],
  },
  {
    h: 'Testing and validation',
    items: [
      'EKF and LQR modelled and run at 1000 Hz in MATLAB / Simulink, tremor amplitude 2–7° and a frequency sweep.',
      'The commit log records a successful run of the EKF and of the LQR on the nRF52840.',
      'Bench video of the gimbal holding the spoon against hand motion.',
    ],
  },
  {
    h: 'Current limitations',
    items: [
      'The suppression figures are from the Simulink model; quantitative benchmarking on the hardware has not been done.',
      'The public repository ships placeholder constants; K and the noise covariances are set per rig.',
      'Servo dynamics are not in the model. Not tested with users.',
      'No tremor frequency or amplitude identification, and no classification, in the firmware.',
    ],
  },
  {
    h: 'Future improvements',
    items: ['Hardware benchmarking against the model.', 'Servo dynamics in the model, and adaptive control.', 'A smaller build and a battery system.'],
  },
]

export const circuitvisionDecisions: Decision[] = [
  { h: 'The engineering problem', items: ['Engineers sketch circuits by hand and then retype them as netlists to simulate them. CircuitVision reads the sketch directly and refuses to return a netlist that does not parse or cannot be simulated.'] },
  {
    h: 'Approaches considered',
    items: [
      'A second input path: an English description of a circuit becomes the same netlist, through an HMM tagger and a series / parallel parser.',
      'Mirrored polarised symbols: their effect depends on undocumented symbol templates, so they were excluded from orientation training and scoring, and counted.',
      'The dataset paper’s train / validation / test split was not adopted; a fixed split (validation drafter 11, test drafter 12) was kept, so numbers are not directly comparable with the paper’s.',
    ],
  },
  {
    h: 'Technical decisions',
    items: [
      'Paper-relative binarisation instead of a global threshold, to survive grid paper and shadows.',
      'YOLOv8s detector; HOG + linear SVM for orientation and polarity.',
      'Symbols are masked during wire tracing so their ink cannot short two wires together; all sizes scale with symbol size.',
      'A grammar (CFG / Earley) and semantic checks gate every netlist, then ngspice computes the operating point.',
      'The dataset is pinned by MD5 for reproducibility.',
    ],
  },
  {
    h: 'Challenges and how they were addressed',
    items: [
      'The real annotation format nests rotation inside the bounding box; the parser read it from the wrong place, so every rotation would have been missing. Fixed, with a regression test.',
      'In 336 training images the annotation size was a placeholder; the first conversion dropped 5,321 boxes. Corrected to use the real image size.',
      'One voltage-source label had all 182 rotated crops marked 0°; the conversion now adds 270° for it.',
      'Two human verification gates stop training until the rotation convention and the label overlays have been checked by a person.',
      'Colab’s OpenCV variants overwrite each other; a pin script restores one working build.',
    ],
  },
  {
    h: 'Testing and validation',
    items: [
      'Detection mAP50 0.904 on an unseen drafter (real photos). Exact wire topology 0.994 over 11 photo conditions on generated circuits with known graphs.',
      'Text → netlist: 0.90 exact on a held-out set, 0.75 on a teammate’s blind set.',
      '136 unit and regression tests.',
    ],
  },
  {
    h: 'Current limitations',
    items: [
      'Full reconstruction on real photos is not yet reliable: 37.5 % correct with ground-truth boxes, 10.4 % with detector boxes, on 48 analog photos.',
      'OCR on real handwriting is the weakest stage (0.021 exact). Battery terminals are the main tracing failure.',
      'Only two-terminal parts are modelled; transistors, ICs and switches are masked.',
    ],
  },
  {
    h: 'Future improvements',
    items: ['Battery terminals in tracing.', 'Value reading on real handwriting.', 'Ruled-paper backgrounds.'],
  },
]

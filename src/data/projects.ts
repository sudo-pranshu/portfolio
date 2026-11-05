/**
 * Project data. Sources: the résumé, and for ParkinSense, CircuitVision, TremoSense, the RL car and the traffic system their public GitHub repositories
 * (README + source), which take precedence where the two disagree.
 * `github` / `demo` are null until a public link exists; the UI hides them when null.
 * `images` is empty until real project photos are added to /public/assets/work/<slug>/.
 */
import { asset } from '../config/personal'

export type Project = {
  slug: 'parkinsense' | 'circuitvision' | 'tremosense' | 'navisight' | 'rl-autonomous-car' | 'wall-e' | 'traffic-management'
  index: string
  title: string
  /** Optional shorter name for compact lists. */
  shortTitle?: string
  subtitle: string
  description: string
  summary: string
  context: string
  role: string
  period: string | null
  technologies: string[]
  keyFigures: { value: string; unit?: string; label: string }[]
  /** One line of documented parameters for the case-study header. */
  parameters?: string
  technicalDetails: string[]
  /** What Pranshu did on the project. */
  contributions?: string[]
  github: string | null
  demo: string | null
  images: { src: string; alt: string }[]
  accent: string
}

export const projects: Project[] = [
  {
    slug: 'parkinsense',
    index: '01',
    title: 'ParkinSense',
    subtitle: 'Wrist-worn IMU + PPG research platform for Parkinson’s tremor monitoring',
    description:
      'An nRF52840 wearable that streams motion and pulse over BLE into a reproducible Python pipeline for tremor, heart-rate and activity biomarkers.',
    summary:
      'Most tremor wearables watch one signal, offline. ParkinSense streams a 6-axis IMU at 104 Hz and a PPG sensor over BLE into a runtime that detects rest tremor and measures its frequency and amplitude, estimates heart rate and HRV, counts steps, tags every output with a quality state, and records every raw sample so any session can be replayed bit-exactly.',
    context: 'IIT Bombay, Machine Intelligence Program; continued independently',
    role: 'Conceived, pitched and built end to end',
    period: 'June 2026 – present',
    technologies: ['nRF52840', 'BLE', 'C / C++ (Arduino)', 'Python', 'SciPy', 'FastAPI', 'Plotly Dash', 'pytest'],
    parameters: 'IMU 104 Hz · 208-byte BLE packets, 10 samples each · 4 s windows every 0.5 s · pipeline 3.0.0',
    keyFigures: [
      { value: '0.99', label: 'Tremor sensitivity, known-answer benchmark' },
      { value: '0.024', unit: 'Hz', label: 'Median tremor-frequency error, benchmark' },
      { value: '0.3', unit: '/min', label: 'False steps during rest tremor, from 23.3' },
    ],
    technicalDetails: [
      'Welch PSD per gyro axis, 3.5–7.5 Hz peak with Gaussian interpolation',
      'Evidence score + 2-state HMM forward filter for tremor state',
      'PPG heart rate, HRV and motion-artefact flags; SpO₂ calibrated against an Amazfit Helio Strap',
      'Step counter gated by motion context, with a tremor guard',
      'Deterministic replay, provenance in every recording, CI test suite',
    ],
    contributions: [
      'Proposed the project at IIT Bombay and built the hardware, firmware, BLE protocol, signal processing and dashboard',
      'Re-engineered the pipeline to 3.0.0: package structure, HMM tremor filter, protocol v2, benchmarks against the old version, decision records',
      'Wrote the test suite (unit, integration, golden regression on real recordings, performance-floor benchmarks) and CI',
    ],
    github: 'https://github.com/sudo-pranshu/ParkinSense',
    demo: null,
    images: [
      { src: asset('assets/work/parkinsense-wrist.jpg'), alt: 'ParkinSense prototype worn on the wrist: a white 3D-printed enclosure on an elastic strap' },
    ],
    accent: 'var(--accent)',
  },
  {
    slug: 'tremosense',
    index: '02',
    title: 'TremoSense',
    subtitle: 'Tremor-suppressing spoon on Zephyr RTOS, for people with Parkinson’s',
    description:
      'A two-axis servo gimbal that holds a spoon steady against hand tremor, using EKF state estimation and LQR control on an nRF52840.',
    summary:
      'The onboard IMU is read at 208 Hz. An Extended Kalman Filter estimates the spoon’s roll and pitch, an LQR controller turns that state into counter-motion, and two servos on a gimbal apply it every 10 ms. The control design was validated in MATLAB and Simulink before being deployed on Zephyr.',
    context: 'Team project, VJTI · with Prithvi Tambewagh and Pawan Shinde',
    role: 'Co-developer',
    period: '2026',
    technologies: ['Zephyr RTOS', 'C', 'XIAO nRF52840 Sense', 'EKF', 'LQR', 'MG995 + FS90MG servos', 'MATLAB / Simulink'],
    parameters: '2 axes, roll + pitch · IMU at 208 Hz · servo update every 10 ms · Simulink validation at 1000 Hz',
    keyFigures: [
      { value: '>90', unit: '%', label: 'Roll suppression across most of 3–7 Hz (simulated)' },
      { value: '>80', unit: '%', label: 'Pitch suppression across most of 3–7 Hz (simulated)' },
      { value: '0.346', unit: '°', label: 'Residual roll RMS, 8° / 8 Hz input (simulated)' },
    ],
    technicalDetails: [
      '2-state EKF (roll, pitch): gyro prediction, accelerometer correction',
      'LQR gain K (2×4) on roll, roll rate, pitch, pitch rate',
      'Zephyr threads, message queue and semaphore',
      'MG995 on roll, FS90MG on pitch',
    ],
    github: 'https://github.com/rkt-1597/TremoSense-Project',
    demo: null,
    images: [{ src: asset('assets/work/tremosense-poster.jpg'), alt: 'TremoSense prototype: a spoon on a servo gimbal held in a hand' }],
    accent: 'var(--accent)',
  },
  {
    slug: 'navisight',
    index: '03',
    title: 'NaviSight',
    subtitle: 'Two assistive devices for visually impaired navigation',
    description:
      'Echo-Stride, a smart cane with obstacle haptics and location sharing, and EyeCue, an ESP32-CAM module that recognises objects on-device.',
    summary:
      'Two devices that split the problem: the cane handles what is directly ahead and where the user is; the vision module handles what is around them.',
    context: 'Academic project',
    role: 'Hardware, firmware and on-device ML',
    period: null,
    technologies: ['Arduino Uno', 'Ultrasonic', 'GPS L80-M39', 'HC-05', 'ESP32-CAM', 'TensorFlow Lite'],
    keyFigures: [
      { value: '2', label: 'Devices, one system' },
    ],
    technicalDetails: [
      'Ultrasonic obstacle detection with vibration and buzzer alerts',
      'GPS + Bluetooth location sent to trusted contacts by SMS',
      'TFLite models running offline on the ESP32-CAM',
    ],
    github: null,
    demo: null,
    images: [],
    accent: 'var(--accent)',
  },
  {
    slug: 'circuitvision',
    index: '04',
    title: 'CircuitVision',
    subtitle: 'Hand-drawn circuit photos to validated, simulatable SPICE netlists',
    description:
      'A computer-vision pipeline that reads a photo of a hand-drawn circuit, finds the components and the wires between them, and writes a SPICE netlist that ngspice can simulate.',
    summary:
      'A phone photo is binarised against the paper, a YOLOv8 detector finds the components, a HOG + SVM classifier reads their orientation, wire tracing rebuilds the nets, EasyOCR reads the values, and the result is checked by a grammar and simulated in ngspice. A second path turns an English description of a circuit into the same netlist.',
    context: 'AI / ML minor project, VJTI · with Pawan Shinde',
    role: 'Project owner; architecture, pipeline and evaluation',
    period: 'September – November 2026',
    technologies: ['Python', 'YOLOv8', 'OpenCV', 'scikit-learn', 'EasyOCR', 'ngspice', 'Gradio', 'pytest'],
    parameters: '9 detector classes · CGHD v14, 2,981 training photos · test on an unseen drafter · 136 tests',
    keyFigures: [
      { value: '0.904', label: 'Detection mAP50 on an unseen drafter (real)' },
      { value: '0.994', label: 'Exact wire topology, 11 photo conditions, known graphs' },
      { value: '0.90', label: 'Text → netlist exact circuits, held-out set' },
    ],
    technicalDetails: [
      'Paper-relative binarisation for grid paper and shadows',
      'YOLOv8s trained on the CGHD handwritten-circuit dataset',
      'HOG + linear SVM orientation and polarity',
      'Wire tracing with symbol masking, terminal rings and crossovers',
      'EasyOCR values, CFG / Earley validation, ngspice operating point',
    ],
    contributions: [
      'Owns the repository and architecture; wrote the core pipeline, evaluation design and project documentation',
      'Reviewed the dataset rotation convention and label conversion (Gates 1 and 2) and audited the merged changes against the running training',
      'Built with Pawan Shinde, who ran the dataset audit, gates, reference netlists, user testing and the final report',
    ],
    github: 'https://github.com/sudo-pranshu/CircuitVision',
    demo: null,
    images: [
      { src: asset('assets/work/cv-u01-overlay.jpg'), alt: 'CircuitVision output on a hand-drawn circuit photo: detected components boxed and each wire net coloured' },
    ],
    accent: 'var(--accent)',
  },
  {
    slug: 'wall-e',
    index: '05',
    title: 'Wall-E',
    subtitle: 'Self-balancing, line-following robot',
    description:
      'A two-wheeled robot on the SRA board that balances itself and follows a line, both under PID control.',
    summary:
      'Built with the Society of Robotics and Automation at VJTI on an ESP32 and the in-house SRA board. Two PID loops: one keeps it upright, one keeps it on the line.',
    context: 'Team project, SRA VJTI',
    role: 'Team member; design, implementation, PID tuning',
    period: null,
    technologies: ['ESP32', 'ESP-IDF', 'SRA Board', 'Light Sensor Array', 'PID', 'Git'],
    keyFigures: [
      { value: '2', label: 'Independent PID loops' },
    ],
    technicalDetails: [
      'Light Sensor Array reads reflectivity to find the line',
      'Line-following PID adjusts differential motor speed',
      'Balancing PID from positional feedback',
    ],
    github: null,
    demo: null,
    images: [],
    accent: 'var(--accent)',
  },
  {
    slug: 'rl-autonomous-car',
    index: '06',
    title: 'RL Autonomous Car',
    shortTitle: 'RL Car',
    subtitle: 'Reinforcement-learning driving agent in a Pygame lane simulation',
    description:
      'A simulated car that learns to change lanes and manage speed around traffic, with a rule-based safety layer and Q-learning working together.',
    summary:
      'A four-lane road in Pygame with obstacles spawning ahead. The running demo pairs a safety layer that predicts where obstacles will be with a tabular Q-learning agent whose lane-change suggestions are trusted a little more as training goes on. The repository also holds a Deep Q-Network version in PyTorch.',
    context: 'Team project · with Pawan Shinde',
    role: 'Co-developer',
    period: '2026',
    technologies: ['Python', 'Pygame', 'NumPy', 'PyTorch', 'Q-learning', 'DQN', 'Matplotlib'],
    parameters: '4 lanes · 4 actions · Q-table 8 × 4 · DQN 6 → 128 → 128 → 4',
    keyFigures: [{ value: '2', label: 'Learning approaches: tabular Q-learning and DQN' }],
    technicalDetails: [
      'Safety layer: obstacle prediction, safe-lane choice, speed bands',
      'Tabular Q-learning, ε-greedy, blended in gradually',
      'DQN with target network and replay buffer',
    ],
    github: 'https://github.com/sudo-pranshu/rl-autonomous-car',
    demo: null,
    images: [],
    accent: 'var(--accent)',
  },
  {
    slug: 'traffic-management',
    index: '07',
    title: 'Automated Traffic Management System',
    shortTitle: 'Traffic System',
    subtitle: 'Real-time vehicle detection and number-plate reading from a live camera',
    description:
      'YOLOv8 finds vehicles in each camera frame, Tesseract reads text from each one, and every frame is logged and charted on a live Streamlit dashboard.',
    summary:
      'A webcam feed goes through YOLOv8, which keeps cars, buses and trucks. Each vehicle is cropped, cleaned up with OpenCV and passed to Tesseract to read the plate. Counts and plates are written to a CSV every frame, and a Streamlit dashboard reads that log to show totals, recent activity and a rolling trend.',
    context: 'Independent project',
    role: 'Built end to end',
    period: 'June 2025',
    technologies: ['Python', 'YOLOv8', 'OpenCV', 'Tesseract OCR', 'pandas', 'Streamlit'],
    parameters: 'YOLOv8n, COCO classes · Otsu threshold + 2× upscale before OCR · one CSV row per frame',
    keyFigures: [],
    technicalDetails: [
      'YOLOv8n detection, vehicle classes only',
      'Crop, grayscale, 2× cubic upscale, Otsu threshold',
      'Tesseract single-line mode, A–Z 0–9 whitelist',
      'Per-frame CSV log, Streamlit dashboard',
    ],
    github: 'https://github.com/sudo-pranshu/Automated-Traffic-Management-System',
    demo: null,
    images: [],
    accent: 'var(--accent)',
  },
]

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)

export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug)
  return projects[(i + 1) % projects.length]
}

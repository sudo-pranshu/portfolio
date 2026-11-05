import { Page } from '../../components/Page'
import { CaseHeader, CaseLinks, CaseSection, NextProject } from '../../components/Case'
import { Reveal } from '../../components/Reveal'
import { Photo } from '../../components/Photo'
import { LineFollower } from '../../components/diagrams/LineFollower'
import { getProject } from '../../data/projects'

const p = getProject('wall-e')!

export default function WallE() {
  return (
    <Page
      title="Wall-E | Self-Balancing Line Follower | Pranshu Kumar"
      description="Wall-E: a two-wheeled self-balancing, line-following robot on an ESP32 and the SRA board, built with the Society of Robotics and Automation at VJTI using two PID loops."
      path="/work/wall-e"
      className="case case--we"
    >
      <CaseHeader p={p} compact />

      <section className="wrap cabstract">
        <p className="cabstract__lede serif">{p.summary}</p>
      </section>

      <section className="wrap we-photo" aria-label="The Wall-E board">
        <Photo
          src="assets/work/walle-board"
          width={1400}
          height={1343}
          alt="Top view of the Wall-E v2.7 robot: the SRA board carrying an ESP-32 module, an MPU-6050 breakout, a motor-driver board, an OLED display and an LED matrix, on a two-wheeled chassis"
          caption="Wall-E v2.7 (2026): the SRA board with the ESP32, MPU-6050, motor driver, OLED and LED matrix"
        />
      </section>

      <CaseSection n="01" title="Two loops, one pair of motors" wide id="loops">
        <Reveal>
          <LineFollower />
        </Reveal>
        <div className="loops">
          <div className="loops__col">
            <span className="label label--accent">Loop 1</span>
            <h3 className="loops__t">Follow the line</h3>
            <p className="prose">
              The Light Sensor Array reads how much light each sensor gets back from the surface. A line, white or
              black, reflects differently from the floor around it, so the array reports where the line sits. A PID
              controller turns that offset into a difference in wheel speeds.
            </p>
          </div>
          <div className="loops__col">
            <span className="label label--accent">Loop 2</span>
            <h3 className="loops__t">Stay upright</h3>
            <p className="prose">
              On two wheels the robot is always falling. A second PID loop uses positional feedback to drive the wheels
              under the body and hold balance while it moves.
            </p>
          </div>
        </div>
      </CaseSection>

      <CaseSection n="02" title="Build notes" wide id="notes">
        <div className="notes notes--2">
          <div className="notes__col">
            <span className="label label--accent">Hardware</span>
            <h3 className="notes__t">ESP32 on the SRA board</h3>
            <p>
              The SRA Board is a custom PCB designed in-house by the Society of Robotics and Automation at VJTI. It
              carries the ESP32 (WROOM-32E), an MPU-6050 IMU port, motor-driver and servo headers, an OLED connector and
              an LED matrix driven by 74HC595 shift registers. Firmware uses ESP-IDF with FreeRTOS tasks and is
              versioned in Git; the public workshop repository also includes a WebSocket interface for tuning without
              reflashing.
            </p>
          </div>
          <div className="notes__col">
            <span className="label label--accent">What was hard</span>
            <h3 className="notes__t">Tuning the gains</h3>
            <p>
              Getting the PID gains right took iterative testing and adjustment. The finished robot followed lines and
              balanced reliably across the test scenarios it was run through.
            </p>
          </div>
        </div>
      </CaseSection>

      <CaseLinks p={p} />
      <NextProject slug={p.slug} />
    </Page>
  )
}

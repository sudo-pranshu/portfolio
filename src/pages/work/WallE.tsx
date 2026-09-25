import { Page } from '../../components/Page'
import { CaseHeader, CaseLinks, CaseSection, NextProject } from '../../components/Case'
import { Reveal } from '../../components/Reveal'
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
              The SRA Board is a custom PCB designed in-house by the Society of Robotics and Automation at VJTI.
              Firmware is written with ESP-IDF and versioned in Git.
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

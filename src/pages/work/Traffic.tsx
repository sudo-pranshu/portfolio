import { Page } from '../../components/Page'
import { CaseHeader, CaseLinks, CaseSection, NextProject } from '../../components/Case'
import { Stages } from '../../components/diagrams/Stages'
import { getProject } from '../../data/projects'

const p = getProject('traffic-management')!

/** Source: github.com/sudo-pranshu/Automated-Traffic-Management-System (main.py, number_plate.py, dashboard.py). */
export default function Traffic() {
  return (
    <Page
      title="Automated Traffic Management System | YOLOv8 + OCR | Pranshu Kumar"
      description="Real-time vehicle detection with YOLOv8, number-plate reading with OpenCV and Tesseract, per-frame CSV logging and a live Streamlit dashboard."
      path="/work/traffic-management"
      className="case case--tr"
    >
      <CaseHeader p={p} compact />

      <section className="wrap cabstract">
        <p className="cabstract__lede serif">{p.summary}</p>
      </section>

      <CaseSection n="01" title="The pipeline" kicker="Every frame, camera to dashboard." wide id="pipeline">
        <Stages
          label="Traffic pipeline"
          stages={[
            { name: 'Capture', detail: 'Webcam frame, OpenCV' },
            { name: 'Detect', detail: 'YOLOv8n; cars, buses, trucks' },
            { name: 'Prepare', detail: 'Crop, grayscale, 2× upscale, Otsu' },
            { name: 'Read', detail: 'Tesseract, single line, A–Z 0–9' },
            { name: 'Log', detail: 'Timestamp, count, plates to CSV' },
            { name: 'Show', detail: 'Streamlit totals and rolling trend' },
          ]}
        />
        <p className="prose csec__p">
          Detection and reading run in one loop that also draws boxes, labels and a running vehicle count on the live
          video. The dashboard is a separate process that only reads the log, so it can be restarted or changed without
          stopping detection. A 12-minute bench session logged 7,885 frames, roughly ten a second.
        </p>
      </CaseSection>

      <CaseSection n="02" title="What comes next" kicker="From the project’s own roadmap." id="next">
        <p className="prose">
          Emergency-vehicle override, a snapshot saved whenever a plate is read, a web-deployed dashboard, rule-violation
          alerts, and driving real signal lights over IoT from a NodeMCU or ESP32, which would close the loop from
          watching traffic to controlling it.
        </p>
      </CaseSection>

      <CaseLinks p={p} />
      <NextProject slug={p.slug} />
    </Page>
  )
}

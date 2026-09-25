import { Page } from '../../components/Page'
import { CaseHeader, CaseLinks, CaseSection, NextProject } from '../../components/Case'
import { Stages } from '../../components/diagrams/Stages'
import { getProject } from '../../data/projects'

const p = getProject('rl-autonomous-car')!

/** Source: github.com/sudo-pranshu/rl-autonomous-car (main.py, agent.py, environment.py). */
export default function RLCar() {
  return (
    <Page
      title="RL Autonomous Car | Q-learning + DQN Driving Simulation | Pranshu Kumar"
      description="A reinforcement-learning driving agent in a four-lane Pygame simulation: a rule-based safety layer blended with tabular Q-learning, plus a PyTorch Deep Q-Network."
      path="/work/rl-autonomous-car"
      className="case case--rl"
    >
      <CaseHeader p={p} compact />

      <section className="wrap cabstract">
        <p className="cabstract__lede serif">{p.summary}</p>
      </section>

      <CaseSection n="01" title="The loop" kicker="30 frames a second, 800 × 600 px road." wide id="loop">
        <Stages
          label="Driving loop in the running demo"
          feedback="reward and next state"
          stages={[
            { name: 'Observe', detail: 'Lane, obstacle ahead' },
            { name: 'Predict', detail: 'Where obstacles will be ~6 frames on' },
            { name: 'Suggest', detail: 'Q-agent picks one of 4 actions' },
            { name: 'Blend', detail: 'Safety layer has the final say' },
            { name: 'Act', detail: 'Change lane, adjust speed' },
          ]}
        />
        <p className="prose csec__p">
          The safety layer picks the nearest lane that will still be clear, eases the target speed down in three
          bands as an obstacle closes in, and cancels a lane change if the destination is about to be occupied. The
          learning agent’s lane-change suggestions are only taken when nothing is close, and are accepted with a
          probability that rises from zero to 0.25 over the first 5,000 steps.
        </p>
      </CaseSection>

      <CaseSection n="02" title="Two learners" kicker="One runs the demo; one is the deep-RL version." wide id="learners">
        <div className="notes notes--2">
          <div className="notes__col">
            <span className="label label--accent">main.py · running demo</span>
            <h3 className="notes__t">Tabular Q-learning</h3>
            <dl className="spec">
              <div className="spec__row">
                <dt className="label">State</dt>
                <dd>8: lane (4) × obstacle ahead (2)</dd>
              </div>
              <div className="spec__row">
                <dt className="label">Actions</dt>
                <dd>Left, right, accelerate, brake</dd>
              </div>
              <div className="spec__row">
                <dt className="label">Update</dt>
                <dd>α 0.1, γ 0.9</dd>
              </div>
              <div className="spec__row">
                <dt className="label">Exploration</dt>
                <dd>ε from 1.0, × 0.998 per step, floor 0.05</dd>
              </div>
              <div className="spec__row">
                <dt className="label">Reward</dt>
                <dd>+1 per step, −5 per nearby obstacle, −100 collision</dd>
              </div>
            </dl>
          </div>
          <div className="notes__col">
            <span className="label label--accent">agent.py + environment.py</span>
            <h3 className="notes__t">Deep Q-Network</h3>
            <dl className="spec">
              <div className="spec__row">
                <dt className="label">Network</dt>
                <dd>MLP 6 → 128 → 128 → 4, ReLU, PyTorch</dd>
              </div>
              <div className="spec__row">
                <dt className="label">State</dt>
                <dd>Distance readings + speed</dd>
              </div>
              <div className="spec__row">
                <dt className="label">Training</dt>
                <dd>Target network, replay of 10,000, batch 64, Adam 1e-3, γ 0.99</dd>
              </div>
              <div className="spec__row">
                <dt className="label">Exploration</dt>
                <dd>ε from 1.0, × 0.985, floor 0.05</dd>
              </div>
              <div className="spec__row">
                <dt className="label">Reward</dt>
                <dd>−200 collision, −50 at the road edge, +10 − 0.1·offset for centring, +3 per step</dd>
              </div>
            </dl>
          </div>
        </div>
      </CaseSection>

      <CaseSection n="03" title="Instrumented" kicker="Watching it learn." id="hud">
        <p className="prose">
          An on-screen readout shows the episode, speed, distance travelled and the live Q-values for the current
          state; a keypress switches between AI and manual driving. Speed, distance and reward histories are plotted
          with Matplotlib after a run.
        </p>
      </CaseSection>

      <CaseLinks p={p} />
      <NextProject slug={p.slug} />
    </Page>
  )
}

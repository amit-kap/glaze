import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@amit-kap/glaze/components/questionnaire"
import { QuestionnaireAnimated } from "./examples/questionnaire/questionnaire-animated"
import { QuestionnaireCard } from "./examples/questionnaire/questionnaire-card"
import { QuestionnaireConditional } from "./examples/questionnaire/questionnaire-conditional"
import { QuestionnaireControlled } from "./examples/questionnaire/questionnaire-controlled"
import { QuestionnaireDemo } from "./examples/questionnaire/questionnaire-demo"
import { QuestionnaireDialog } from "./examples/questionnaire/questionnaire-dialog"
import { QuestionnaireFreeform } from "./examples/questionnaire/questionnaire-freeform"
import { QuestionnaireMultiple } from "./examples/questionnaire/questionnaire-multiple"
import { QuestionnaireNavigationState } from "./examples/questionnaire/questionnaire-navigation-state"
import { QuestionnaireProgressExample } from "./examples/questionnaire/questionnaire-progress"
import { QuestionnaireResume } from "./examples/questionnaire/questionnaire-resume"
import { QuestionnaireShortcuts } from "./examples/questionnaire/questionnaire-shortcuts"
import { QuestionnaireSkipExample } from "./examples/questionnaire/questionnaire-skip"
import { QuestionnaireValidation } from "./examples/questionnaire/questionnaire-validation"
import { ExampleToaster } from "./examples/toast"

// Stories follow the upstream shadcn/ui (base-nova) Questionnaire examples:
// https://ui.shadcn.com/docs/components/base/questionnaire
// The examples are long, so they live in ./examples/questionnaire as copies
// of upstream with Glaze imports; sonner's toast goes through ../toast.
const meta = {
  title: "Components/Questionnaire",
  component: Questionnaire,
  subcomponents: {
    QuestionnaireActions,
    QuestionnaireChoice,
    QuestionnaireChoiceDescription,
    QuestionnaireChoices,
    QuestionnaireDescription,
    QuestionnaireError,
    QuestionnaireInput,
    QuestionnaireItem,
    QuestionnaireNext,
    QuestionnairePrevious,
    QuestionnaireProgress,
    QuestionnaireSkip,
    QuestionnaireSubmit,
    QuestionnaireTitle,
  },
  parameters: {
    docs: {
      description: {
        component:
          "A step-by-step set of questions with single or multiple choice, freeform answers, validation, skipping and keyboard shortcuts.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-md">
        <Story />
        <ExampleToaster />
      </div>
    ),
  ],
} satisfies Meta<typeof Questionnaire>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

export const Default: Story = { render: () => <QuestionnaireDemo /> }

// --- Variants -------------------------------------------------------------

export const MultipleSelection: Story = {
  render: () => <QuestionnaireMultiple />,
}

export const FreeformAnswer: Story = {
  render: () => <QuestionnaireFreeform />,
}

export const ExplicitSkip: Story = {
  render: () => <QuestionnaireSkipExample />,
}

export const Shortcuts: Story = { render: () => <QuestionnaireShortcuts /> }

// --- States ---------------------------------------------------------------

export const CustomValidation: Story = {
  render: () => <QuestionnaireValidation />,
}

export const Controlled: Story = { render: () => <QuestionnaireControlled /> }

export const Resume: Story = { render: () => <QuestionnaireResume /> }

export const ConditionalItems: Story = {
  render: () => <QuestionnaireConditional />,
}

export const NavigationState: Story = {
  render: () => <QuestionnaireNavigationState />,
}

// --- Compositions ---------------------------------------------------------

export const CustomProgress: Story = {
  render: () => <QuestionnaireProgressExample />,
}

export const AnimatedItems: Story = {
  render: () => <QuestionnaireAnimated />,
}

export const InCard: Story = { render: () => <QuestionnaireCard /> }

export const InDialog: Story = { render: () => <QuestionnaireDialog /> }

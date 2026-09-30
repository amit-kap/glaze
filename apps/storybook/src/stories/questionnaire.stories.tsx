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
} from "@workspace/ui/components/questionnaire"

function QuestionnaireDemo({ shortcuts = "letters" }: { shortcuts?: "letters" | "numbers" }) {
  return (
    <Questionnaire
      className="w-md"
      shortcuts={shortcuts}
      onSubmit={(event) => event.preventDefault()}
    >
      <QuestionnaireProgress />
      <QuestionnaireItem name="role" required>
        <QuestionnaireTitle>What best describes your role?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="design">Design</QuestionnaireChoice>
          <QuestionnaireChoice value="engineering">Engineering</QuestionnaireChoice>
          <QuestionnaireChoice value="product">Product</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError>Pick one to continue.</QuestionnaireError>
      </QuestionnaireItem>
      <QuestionnaireItem name="tools" multiple>
        <QuestionnaireTitle>Which tools do you use daily?</QuestionnaireTitle>
        <QuestionnaireDescription>Select all that apply.</QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="figma">
            Figma
            <QuestionnaireChoiceDescription>Design and prototyping</QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="vscode">
            VS Code
            <QuestionnaireChoiceDescription>Code editing</QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="linear">
            Linear
            <QuestionnaireChoiceDescription>Issue tracking</QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireItem name="email">
        <QuestionnaireTitle>Where should we send the results?</QuestionnaireTitle>
        <QuestionnaireInput type="email" placeholder="you@example.com" />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext />
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  )
}

const meta = {
  title: "Components/Questionnaire",
  component: QuestionnaireDemo,
  argTypes: { shortcuts: { control: "radio", options: ["letters", "numbers"] } },
} satisfies Meta<typeof QuestionnaireDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const NumberShortcuts: Story = { args: { shortcuts: "numbers" } }

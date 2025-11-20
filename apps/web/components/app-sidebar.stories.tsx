import type { Meta, StoryObj } from "@storybook/react"
import { AppSidebar } from "./app-sidebar"
import {
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"

const meta = {
  title: "Navigation/AppSidebar",
  component: AppSidebar,
  parameters: {
    layout: "fullscreen",
    a11y: {
      // Keep a11y checks visible in the UI; CI behavior configured in preview
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AppSidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Expanded: Story = {
  name: "Expanded (default)",
  render: () => (
    <SidebarProvider defaultOpen>
      <div className="flex h-[480px] w-full border">
        <AppSidebar />
        <div className="flex-1">
          <header className="flex h-12 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <span className="text-sm text-muted-foreground">
              Use the trigger or press Cmd/Ctrl + B to toggle the sidebar
            </span>
          </header>
          <main className="p-4 text-sm text-muted-foreground">
            This area represents your app content.
          </main>
        </div>
      </div>
    </SidebarProvider>
  ),
}

export const Collapsed: Story = {
  name: "Collapsed",
  render: () => (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-[480px] w-full border">
        <AppSidebar />
        <div className="flex-1">
          <header className="flex h-12 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <span className="text-sm text-muted-foreground">
              Click to open the sidebar
            </span>
          </header>
          <main className="p-4 text-sm text-muted-foreground">
            This area represents your app content.
          </main>
        </div>
      </div>
    </SidebarProvider>
  ),
}

import { ArrowUpIcon, PaperclipIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@amit-kap/glaze/components/avatar"
import { Badge } from "@amit-kap/glaze/components/badge"
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
} from "@amit-kap/glaze/components/bubble"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@amit-kap/glaze/components/input-group"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@amit-kap/glaze/components/message"

/** A conversation with a teammate: grouped messages and a composer. */
export function Chat() {
  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <header className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3">
        <Avatar>
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-body leading-tight font-medium">
            Jackson Lee
          </p>
          <p className="text-caption text-muted-foreground">Active now</p>
        </div>
        <Badge variant="secondary" className="ms-auto">
          Order #1042
        </Badge>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
        <p className="mt-auto text-center text-micro text-muted-foreground">
          Today
        </p>

        <MessageGroup>
          <Message>
            <MessageAvatar>
              <Avatar size="sm">
                <AvatarFallback className="text-micro">JL</AvatarFallback>
              </Avatar>
            </MessageAvatar>
            <MessageContent>
              <MessageHeader>Jackson Lee</MessageHeader>
              <BubbleGroup>
                <Bubble variant="secondary">
                  <BubbleContent>
                    Hi! My order still shows as pending. Can you check on it?
                  </BubbleContent>
                </Bubble>
                <Bubble variant="secondary">
                  <BubbleContent>It was placed on Tuesday.</BubbleContent>
                </Bubble>
              </BubbleGroup>
            </MessageContent>
          </Message>
        </MessageGroup>

        <MessageGroup>
          <Message align="end">
            <MessageContent>
              <BubbleGroup>
                <Bubble align="end">
                  <BubbleContent>
                    Of course, looking now. Payment cleared this morning.
                  </BubbleContent>
                </Bubble>
                <Bubble align="end">
                  <BubbleContent>
                    It ships tomorrow, and I&apos;ll send tracking.
                  </BubbleContent>
                </Bubble>
              </BubbleGroup>
              <MessageFooter>Delivered 10:42</MessageFooter>
            </MessageContent>
          </Message>
        </MessageGroup>

        <MessageGroup>
          <Message>
            <MessageAvatar>
              <Avatar size="sm">
                <AvatarFallback className="text-micro">JL</AvatarFallback>
              </Avatar>
            </MessageAvatar>
            <MessageContent>
              <BubbleGroup>
                <Bubble variant="secondary">
                  <BubbleContent>Perfect, thank you!</BubbleContent>
                </Bubble>
              </BubbleGroup>
            </MessageContent>
          </Message>
        </MessageGroup>
      </div>

      <div className="shrink-0 border-t border-border p-3">
        <InputGroup>
          <InputGroupInput placeholder="Write a message" aria-label="Message" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" aria-label="Attach a file">
              <PaperclipIcon />
            </InputGroupButton>
            <InputGroupButton
              size="icon-xs"
              variant="default"
              aria-label="Send"
            >
              <ArrowUpIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  )
}

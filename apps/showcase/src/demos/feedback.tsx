import * as React from "react"
import { AlertCircleIcon, CheckCircle2Icon, InfoIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@amit-kap/glaze/components/alert"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@amit-kap/glaze/components/item"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@amit-kap/glaze/components/progress"
import { Skeleton } from "@amit-kap/glaze/components/skeleton"
import { Spinner } from "@amit-kap/glaze/components/spinner"

import { Row } from "./layout"

// Stories: Default, Destructive.
export function AlertDemo() {
  return (
    <div className="grid w-full max-w-md items-start gap-4">
      <Alert>
        <CheckCircle2Icon />
        <AlertTitle>Payment successful</AlertTitle>
        <AlertDescription>
          Your payment of $29.99 has been processed. A receipt has been sent to
          your email address.
        </AlertDescription>
      </Alert>
      <Alert>
        <InfoIcon />
        <AlertTitle>New feature available</AlertTitle>
        <AlertDescription>
          We&apos;ve added dark mode support. You can enable it in your account
          settings.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>
          Your payment could not be processed. Please check your payment method
          and try again.
        </AlertDescription>
      </Alert>
    </div>
  )
}

// Stories: Default, Label.
export function ProgressDemo() {
  const [progress, setProgress] = React.useState(13)
  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-8">
      <Progress value={progress} className="w-[60%]" aria-label="Progress" />
      <Progress value={56} className="w-full">
        <ProgressLabel>Upload progress</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  )
}

// Stories: Default, In Button.
export function SpinnerDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-4">
      <Item variant="muted" className="w-full">
        <ItemMedia>
          <Spinner />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1">Processing payment...</ItemTitle>
        </ItemContent>
        <ItemContent className="flex-none justify-end">
          <span className="text-body tabular-nums">$100.00</span>
        </ItemContent>
      </Item>
      <Row>
        <Button disabled size="sm">
          <Spinner data-icon="inline-start" />
          Loading...
        </Button>
        <Button variant="outline" disabled size="sm">
          <Spinner data-icon="inline-start" />
          Please wait
        </Button>
        <Button variant="secondary" disabled size="sm">
          <Spinner data-icon="inline-start" />
          Processing
        </Button>
      </Row>
    </div>
  )
}

// Story: Default.
export function SkeletonDemo() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="size-12 rounded-pill" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}

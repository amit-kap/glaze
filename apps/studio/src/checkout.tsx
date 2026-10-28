import * as React from "react"
import {
  MinusIcon,
  PlusIcon,
  ShirtIcon,
  ShoppingBagIcon,
  Trash2Icon,
  FootprintsIcon,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@amit-kap/glaze/components/button"
import { Checkbox } from "@amit-kap/glaze/components/checkbox"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@amit-kap/glaze/components/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@amit-kap/glaze/components/field"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@amit-kap/glaze/components/dialog"
import { Input } from "@amit-kap/glaze/components/input"
import {
  RadioGroup,
  RadioGroupItem,
} from "@amit-kap/glaze/components/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amit-kap/glaze/components/select"
import { Separator } from "@amit-kap/glaze/components/separator"

type CartItem = {
  id: string
  name: string
  detail: string
  price: number
  quantity: number
  icon: LucideIcon
}

const initialCart: CartItem[] = [
  {
    id: "sneaker",
    name: "Stylish Maroon Sneaker",
    detail: "Red / 36",
    price: 354,
    quantity: 1,
    icon: FootprintsIcon,
  },
  {
    id: "sweatshirt",
    name: "Bicolor Sweatshirt with Embroidered Logo",
    detail: "Blue & White / L",
    price: 499,
    quantity: 1,
    icon: ShirtIcon,
  },
  {
    id: "handbag",
    name: "Maroon Leather Handbag",
    detail: "Maroon",
    price: 245,
    quantity: 1,
    icon: ShoppingBagIcon,
  },
]

const countries = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "gb", label: "United Kingdom" },
  { value: "de", label: "Germany" },
]

const shipping = [
  { value: "standard", label: "Standard", note: "5–7 business days", price: 0 },
  { value: "express", label: "Express", note: "2–3 business days", price: 15 },
  {
    value: "overnight",
    label: "Overnight",
    note: "Next business day",
    price: 35,
  },
]

const payments = [
  { value: "card", label: "Credit card" },
  { value: "paypal", label: "PayPal" },
  { value: "bank", label: "Bank transfer" },
]

const money = (amount: number) =>
  amount.toLocaleString("en-US", { style: "currency", currency: "USD" })

/** A checkout page: contact, address, shipping and payment beside an editable order summary. */
export function Checkout() {
  const [cart, setCart] = React.useState(initialCart)
  const [method, setMethod] = React.useState("standard")
  const [payment, setPayment] = React.useState("card")

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const shippingCost =
    shipping.find((item) => item.value === method)?.price ?? 0
  const tax = Math.round(subtotal * 0.0326 * 100) / 100
  const total = subtotal + shippingCost + tax

  const setQuantity = (id: string, quantity: number) =>
    setCart((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    )

  return (
    <div className="h-full overflow-y-auto bg-muted/40 p-4 @min-[600px]:p-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-control bg-brand text-caption font-medium text-brand-ink">
            A
          </div>
          <div>
            <h2 className="text-heading leading-tight font-medium">Checkout</h2>
            <p className="text-caption text-muted-foreground">
              Complete your purchase securely
            </p>
          </div>
        </div>

        <div className="grid items-start gap-4 @min-[800px]:grid-cols-[3fr_2fr]">
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact information</CardTitle>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="checkout-email">Email</FieldLabel>
                    <Input
                      id="checkout-email"
                      type="email"
                      placeholder="your@email.com"
                    />
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox id="checkout-news" />
                    <FieldLabel htmlFor="checkout-news" className="font-normal">
                      Email me with news and offers
                    </FieldLabel>
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping address</CardTitle>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Country</FieldLabel>
                    <Select items={countries} defaultValue="us">
                      <SelectTrigger aria-label="Country" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="checkout-first">
                        First name
                      </FieldLabel>
                      <Input id="checkout-first" />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="checkout-last">Last name</FieldLabel>
                      <Input id="checkout-last" />
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="checkout-address">Address</FieldLabel>
                    <Input id="checkout-address" />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="checkout-zip">
                        Postal code
                      </FieldLabel>
                      <Input id="checkout-zip" />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="checkout-city">City</FieldLabel>
                      <Input id="checkout-city" />
                    </Field>
                  </div>
                </FieldGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={method}
                  onValueChange={(next) => setMethod(String(next))}
                  aria-label="Shipping method"
                >
                  {shipping.map((item) => (
                    <Field key={item.value} orientation="horizontal">
                      <RadioGroupItem
                        id={`ship-${item.value}`}
                        value={item.value}
                      />
                      <FieldContent>
                        <FieldLabel htmlFor={`ship-${item.value}`}>
                          {item.label}
                        </FieldLabel>
                        <FieldDescription>{item.note}</FieldDescription>
                      </FieldContent>
                      <span className="text-caption tabular-nums">
                        {item.price === 0 ? "Free" : money(item.price)}
                      </span>
                    </Field>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <RadioGroup
                    value={payment}
                    onValueChange={(next) => setPayment(String(next))}
                    aria-label="Payment method"
                  >
                    {payments.map((item) => (
                      <Field key={item.value} orientation="horizontal">
                        <RadioGroupItem
                          id={`pay-${item.value}`}
                          value={item.value}
                        />
                        <FieldLabel
                          htmlFor={`pay-${item.value}`}
                          className="font-normal"
                        >
                          {item.label}
                        </FieldLabel>
                      </Field>
                    ))}
                  </RadioGroup>
                  {payment === "card" && (
                    <>
                      <Field>
                        <FieldLabel htmlFor="checkout-card">
                          Card number
                        </FieldLabel>
                        <Input
                          id="checkout-card"
                          inputMode="numeric"
                          placeholder="1234 1234 1234 1234"
                        />
                      </Field>
                      <div className="grid grid-cols-2 gap-4">
                        <Field>
                          <FieldLabel htmlFor="checkout-exp">Expiry</FieldLabel>
                          <Input id="checkout-exp" placeholder="MM / YY" />
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="checkout-cvc">CVC</FieldLabel>
                          <Input id="checkout-cvc" placeholder="123" />
                        </Field>
                      </div>
                    </>
                  )}
                </FieldGroup>
              </CardContent>
            </Card>
          </div>

          <Card className="@min-[800px]:sticky @min-[800px]:top-0">
            <CardHeader>
              <CardTitle>Order summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {cart.length === 0 && (
                <p className="py-6 text-center text-caption text-muted-foreground">
                  Your cart is empty.
                </p>
              )}
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground [&_svg]:size-6">
                    <item.icon />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-caption leading-snug font-medium">
                          {item.name}
                        </p>
                        <p className="text-micro text-muted-foreground">
                          {item.detail}
                        </p>
                      </div>
                      <span className="text-caption font-medium tabular-nums">
                        {money(item.price * item.quantity)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon-xs"
                          aria-label={`Decrease ${item.name}`}
                          onClick={() =>
                            setQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <MinusIcon />
                        </Button>
                        <span className="w-6 text-center text-caption tabular-nums">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon-xs"
                          aria-label={`Increase ${item.name}`}
                          onClick={() =>
                            setQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <PlusIcon />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Remove ${item.name}`}
                        onClick={() =>
                          setCart((items) =>
                            items.filter((other) => other.id !== item.id)
                          )
                        }
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <Separator />

              <dl className="flex flex-col gap-1.5 text-caption">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="tabular-nums">{money(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="tabular-nums">
                    {shippingCost === 0 ? "Free" : money(shippingCost)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Estimated tax</dt>
                  <dd className="tabular-nums">{money(tax)}</dd>
                </div>
              </dl>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-body font-medium">Total</span>
                <span className="text-heading font-medium tabular-nums">
                  {money(total)}
                </span>
              </div>

              <Dialog>
                <DialogTrigger
                  render={<Button size="lg" disabled={cart.length === 0} />}
                >
                  Place order
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Order placed</DialogTitle>
                    <DialogDescription>
                      Thanks! We sent a receipt for {money(total)} to your
                      email, and the order ships in 5–7 business days.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose render={<Button variant="outline" />}>
                      Keep shopping
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { formatPythonISODate } from "@/lib/utils";

const schema = z.object({
  amount: z
    .string()
    .nonempty("Amount is required")
    .refine(
      (val) => {
        const cleaned = String(val).replace(/[^0-9.-]+/g, "");
        const parsed = parseFloat(cleaned);
        return Number.isFinite(parsed);
      },
      { message: "Enter a valid dollar amount" }
    ),
  date: z.date(),
  description: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function AddTransaction({
  onSubmit,
}: {
  onSubmit?: (payload: {
    amountCents: number;
    date: string;
    description?: string | null;
  }) => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { amount: "", date: new Date() },
  });

  const amountRaw = watch("amount") || "";
  const parsedAmount = parseFloat(amountRaw.replace(/[$,\s]/g, ""));
  const isPositive = Number.isFinite(parsedAmount) && parsedAmount > 0;
  const isNegative = Number.isFinite(parsedAmount) && parsedAmount < 0;

  const [calendarOpen, setCalendarOpen] = useState(false);

  async function submit(values: FormValues) {
    const parsed = parseFloat(values.amount.replace(/[$,\s]/g, ""));
    const amountCents = Number.isFinite(parsed) ? Math.round(parsed * 100) : 0;
    // produce a Python-friendly ISO datetime
    const dateIso: string = formatPythonISODate(values.date);

    const payload = {
      amountCents,
      date: dateIso,
      description: values.description ?? null,
    };
    if (onSubmit) {
      console.log("AddTransaction submit:", payload);
      onSubmit(payload);
    } else {
      console.log("AddTransaction submit:", payload);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(submit)}
          className="flex flex-col gap-4 w-full max-w-md"
        >
          <Field>
            <FieldLabel>
              <Label>Amount</Label>
            </FieldLabel>
            <FieldContent>
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  $
                </span>
                <Input
                  placeholder="0.00"
                  className={`pl-8 transition hover:shadow-md hover:ring-2 hover:ring-primary/30 ${
                    isPositive
                      ? "text-green-600"
                      : isNegative
                      ? "text-destructive"
                      : ""
                  }`}
                  {...register("amount", {
                    required: "Amount is required",
                    pattern: {
                      value: /^\$?\s*-?\d+(?:\.\d{1,2})?$/,
                      message: "Enter a valid dollar amount (e.g. -10.50)",
                    },
                  })}
                />
              </div>
              <FieldError
                errors={[
                  errors.amount && {
                    message: (errors.amount as any).message,
                  },
                ]}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>
              <Label>Date</Label>
            </FieldLabel>
            <FieldContent>
              <Controller
                name="date"
                control={control}
                render={({ field }) => {
                  const selected: Date | undefined =
                    (field.value as Date) ?? undefined;

                  function formatDate(d: Date) {
                    const mm = String(d.getMonth() + 1).padStart(2, "0");
                    const dd = String(d.getDate()).padStart(2, "0");
                    const yyyy = String(d.getFullYear());
                    return `${mm}/${dd}/${yyyy}`;
                  }

                  const display = selected
                    ? formatDate(selected)
                    : "Select Date";

                  return (
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <div className="relative w-full">
                          <Input
                            readOnly
                            value={display}
                            className="pr-10 text-left cursor-pointer transition hover:shadow-md hover:ring-2 hover:ring-primary/30"
                          />
                          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                            <CalendarIcon className="size-4 opacity-70" />
                          </div>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selected}
                          onSelect={(date: any) => {
                            if (date instanceof Date) {
                              field.onChange(date);
                            } else if (
                              Array.isArray(date) &&
                              date[0] instanceof Date
                            ) {
                              field.onChange(date[0] as Date);
                            }
                            setCalendarOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  );
                }}
              />

              <FieldError
                errors={[
                  errors.date && { message: (errors.date as any).message },
                ]}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>
              <Label>Description</Label>
            </FieldLabel>
            <FieldContent>
              <Input
                placeholder="Add a note (optional)"
                {...register("description")}
                className="transition hover:shadow-md hover:ring-2 hover:ring-primary/30"
              />
              <FieldError
                errors={[
                  errors.description && {
                    message: (errors.description as any).message,
                  },
                ]}
              />
            </FieldContent>
          </Field>

          <div className="flex items-center gap-2">
            <Button
              className="cursor-pointer"
              type="submit"
              disabled={isSubmitting}
            >
              Add
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

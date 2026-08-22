import type { ColumnDataType } from "../features/columns/column.types";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { CalendarIcon } from "lucide-react";

import { format } from "date-fns";
import { ro } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

type ColumnFormFieldsProps = {
  name: string;
  dataType: ColumnDataType;
  length: string;
  precision: string;
  scale: string;
  nullable: boolean;
  unique: boolean;
  autoIncrement: boolean;
  defaultValue: string;

  onNameChange: (value: string) => void;
  onDataTypeChange: (value: ColumnDataType) => void;
  onLengthChange: (value: string) => void;
  onPrecisionChange: (value: string) => void;
  onScaleChange: (value: string) => void;
  onNullableChange: (value: boolean) => void;
  onUniqueChange: (value: boolean) => void;
  onAutoIncrementChange: (value: boolean) => void;
  onDefaultValueChange: (value: string) => void;
};

export function ColumnFormFields({
  name,
  dataType,
  length,
  precision,
  scale,
  nullable,
  unique,
  autoIncrement,
  defaultValue,

  onNameChange,
  onDataTypeChange,
  onLengthChange,
  onPrecisionChange,
  onScaleChange,
  onNullableChange,
  onUniqueChange,
  onAutoIncrementChange,
  onDefaultValueChange,
}: ColumnFormFieldsProps) {
  const usesLength =
    dataType === "VARCHAR" ||
    dataType === "CHAR";

  const usesDecimalOptions =
    dataType === "DECIMAL";

  const supportsAutoIncrement =
    dataType === "INT" ||
    dataType === "BIGINT";

  function handleDataTypeChange(
    value: ColumnDataType,
    ): void {
    if (value === dataType) {
        return;
    }

    onDataTypeChange(value);

    // Valoarea implicită poate să nu mai fie
    // compatibilă cu noul tip de date.
    onDefaultValueChange("");

    if (
        value !== "VARCHAR" &&
        value !== "CHAR"
    ) {
        onLengthChange("");
    }

    if (value !== "DECIMAL") {
        onPrecisionChange("");
        onScaleChange("");
    }

    if (
        value !== "INT" &&
        value !== "BIGINT"
    ) {
        onAutoIncrementChange(false);
    }
    }

  function parseSqlDate(
    value: string,
    ): Date | undefined {
    if (!value) {
        return undefined;
    }

    const [year, month, day] =
        value.split("-").map(Number);

    if (!year || !month || !day) {
        return undefined;
    }

    return new Date(
        year,
        month - 1,
        day,
    );
    }

    function formatDateForSql(
    date: Date,
    ): string {
    return format(
        date,
        "yyyy-MM-dd",
    );
    }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="column-name"
          className="text-sm font-medium"
        >
          Nume coloană
        </label>

        <Input
          id="column-name"
          value={name}
          onChange={(event) =>
            onNameChange(event.target.value)
          }
          placeholder="Exemplu: nume"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">
          Tip de date
        </label>

        <Select
          value={dataType}
          onValueChange={(value) =>
            handleDataTypeChange(
              value as ColumnDataType,
            )
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="INT">
              INT
            </SelectItem>

            <SelectItem value="BIGINT">
              BIGINT
            </SelectItem>

            <SelectItem value="DECIMAL">
              DECIMAL
            </SelectItem>

            <SelectItem value="VARCHAR">
              VARCHAR
            </SelectItem>

            <SelectItem value="CHAR">
              CHAR
            </SelectItem>

            <SelectItem value="TEXT">
              TEXT
            </SelectItem>

            <SelectItem value="BOOLEAN">
              BOOLEAN
            </SelectItem>

            <SelectItem value="DATE">
              DATE
            </SelectItem>

            <SelectItem value="DATETIME">
              DATETIME
            </SelectItem>

            <SelectItem value="TIMESTAMP">
              TIMESTAMP
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {usesLength && (
        <div className="flex flex-col gap-2">
          <label
            htmlFor="column-length"
            className="text-sm font-medium"
          >
            Lungime
          </label>

          <Input
            id="column-length"
            type="number"
            min={1}
            max={65535}
            value={length}
            onChange={(event) =>
              onLengthChange(
                event.target.value,
              )
            }
            placeholder="Exemplu: 100"
          />
        </div>
      )}

      {usesDecimalOptions && (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="column-precision"
              className="text-sm font-medium"
            >
              Precizie
            </label>

            <Input
              id="column-precision"
              type="number"
              min={1}
              max={65}
              value={precision}
              onChange={(event) =>
                onPrecisionChange(
                  event.target.value,
                )
              }
              placeholder="Exemplu: 10"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="column-scale"
              className="text-sm font-medium"
            >
              Scală
            </label>

            <Input
              id="column-scale"
              type="number"
              min={0}
              value={scale}
              onChange={(event) =>
                onScaleChange(
                  event.target.value,
                )
              }
              placeholder="Exemplu: 2"
            />
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border bg-background/40 p-4">
        <div className="flex flex-col gap-4">
          <label className="flex cursor-pointer items-center gap-3">
            <Checkbox
              checked={nullable}
              onCheckedChange={(checked) =>
                onNullableChange(
                  checked === true,
                )
              }
            />

            <div>
              <div className="text-sm font-medium">
                Permite NULL
              </div>

              <div className="text-xs text-muted-foreground">
                Coloana poate să nu conțină o valoare.
              </div>
            </div>
          </label>

          <label className="flex cursor-pointer items-center gap-3">
            <Checkbox
              checked={unique}
              onCheckedChange={(checked) =>
                onUniqueChange(
                  checked === true,
                )
              }
            />

            <div>
              <div className="text-sm font-medium">
                UNIQUE
              </div>

              <div className="text-xs text-muted-foreground">
                Nu permite valori duplicate.
              </div>
            </div>
          </label>

          <label
            className={`flex items-center gap-3 ${
              supportsAutoIncrement
                ? "cursor-pointer"
                : "cursor-not-allowed opacity-50"
            }`}
          >
            <Checkbox
              checked={autoIncrement}
              disabled={!supportsAutoIncrement}
              onCheckedChange={(checked) =>
                onAutoIncrementChange(
                  checked === true,
                )
              }
            />

            <div>
              <div className="text-sm font-medium">
                AUTO_INCREMENT
              </div>

              <div className="text-xs text-muted-foreground">
                Disponibil doar pentru INT și BIGINT.
              </div>
            </div>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2">
  <label className="text-sm font-medium">
    Valoare implicită
  </label>

  {dataType === "DATE" ? (
    <Popover>
      <PopoverTrigger
        render={(props) => (
          <button
            {...props}
            type="button"
            className="flex h-9 w-full items-center justify-start gap-2 rounded-md border border-input bg-background px-3 text-left text-sm font-normal shadow-xs outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <CalendarIcon className="size-4 shrink-0" />

            {defaultValue ? (
              <span>
                {format(
                  parseSqlDate(defaultValue)!,
                  "d MMMM yyyy",
                  {
                    locale: ro,
                  },
                )}
              </span>
            ) : (
              <span className="text-muted-foreground">
                Selectează data
              </span>
            )}
          </button>
        )}
      />

      <PopoverContent
        className="w-auto p-0"
        align="start"
      >
        <Calendar
          mode="single"
          locale={ro}
          selected={parseSqlDate(defaultValue)}
          onSelect={(date) => {
            if (!date) {
              onDefaultValueChange("");
              return;
            }

            onDefaultValueChange(
              formatDateForSql(date),
            );
          }}
        />

        <div className="flex items-center justify-between border-t border-border p-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!defaultValue}
            onClick={() =>
              onDefaultValueChange("")
            }
          >
            Șterge data
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              onDefaultValueChange(
                formatDateForSql(new Date()),
              )
            }
          >
            Astăzi
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  ) : dataType === "DATETIME" ||
    dataType === "TIMESTAMP" ? (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex flex-col gap-2">
  <span className="text-xs text-muted-foreground">
    Data
  </span>

  <Popover>
    <PopoverTrigger
      render={(props) => (
        <button
          {...props}
          type="button"
          className="flex h-9 w-full items-center justify-start gap-2 rounded-md border border-input bg-background px-3 text-left text-sm font-normal shadow-xs outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <CalendarIcon className="size-4 shrink-0" />

          {defaultValue ? (
            <span>
              {format(
                parseSqlDate(
                  defaultValue.slice(0, 10),
                )!,
                "d MMMM yyyy",
                {
                  locale: ro,
                },
              )}
            </span>
          ) : (
            <span className="text-muted-foreground">
              Selectează data
            </span>
          )}
        </button>
      )}
    />

    <PopoverContent
      className="w-auto p-0"
      align="start"
    >
      <Calendar
        mode="single"
        locale={ro}
        selected={
          defaultValue
            ? parseSqlDate(
                defaultValue.slice(0, 10),
              )
            : undefined
        }
        onSelect={(date) => {
          if (!date) {
            onDefaultValueChange("");
            return;
          }

          const time =
            defaultValue.length >= 16
              ? defaultValue.slice(11, 16)
              : "00:00";

          onDefaultValueChange(
            `${formatDateForSql(date)} ${time}:00`,
          );
        }}
      />
    </PopoverContent>
  </Popover>
</div>

<div className="flex flex-col gap-2">
  <span className="text-xs text-muted-foreground">
    Ora
  </span>

  <Input
    type="time"
    value={
      defaultValue.length >= 16
        ? defaultValue.slice(11, 16)
        : "00:00"
    }
    onChange={(event) => {
      const time = event.target.value;

      if (!time) {
        return;
      }

      const date =
        defaultValue.slice(0, 10);

      if (!date) {
        return;
      }

      onDefaultValueChange(
        `${date} ${time}:00`,
      );
    }}
    className="dark:scheme-dark"
  />
</div>
    </div>
  ) : dataType === "BOOLEAN" ? (
    <Select
      value={defaultValue || "NONE"}
      onValueChange={(value) => {
  if (value === null || value === "NONE") {
    onDefaultValueChange("");
    return;
  }

  onDefaultValueChange(value);
}}
    >
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="NONE">
          Fără valoare implicită
        </SelectItem>

        <SelectItem value="TRUE">
          TRUE
        </SelectItem>

        <SelectItem value="FALSE">
          FALSE
        </SelectItem>
      </SelectContent>
    </Select>
  ) : (
    <Input
      id="column-default-value"
      type={
        dataType === "INT" ||
        dataType === "BIGINT" ||
        dataType === "DECIMAL"
          ? "number"
          : "text"
      }
      step={
        dataType === "DECIMAL"
          ? "any"
          : undefined
      }
      value={defaultValue}
      onChange={(event) =>
        onDefaultValueChange(
          event.target.value,
        )
      }
      placeholder="Opțional"
    />
  )}

  <p className="text-xs text-muted-foreground">
    Valoarea folosită implicit dacă nu este furnizată una explicită.
  </p>
</div>
    </div>
  );
}
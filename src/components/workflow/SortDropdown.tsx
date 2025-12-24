"use client";

import { useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "recent", label: "Recently Updated" },
  { value: "downloads", label: "Most Downloads" },
  { value: "name", label: "Name (A-Z)" },
];

interface SortDropdownProps {
  currentSort?: string;
}

export function SortDropdown({ currentSort = "popular" }: SortDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSort = useCallback(
    (value: string) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (value === "popular") {
          params.delete("sort");
        } else {
          params.set("sort", value);
        }

        // Reset page on sort change
        params.delete("page");

        router.push(`/explore?${params.toString()}`);
      });
    },
    [router, searchParams],
  );

  const currentOption =
    SORT_OPTIONS.find((opt) => opt.value === currentSort) || SORT_OPTIONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isPending}>
          <ArrowUpDown className="h-4 w-4 mr-2" />
          {currentOption.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {SORT_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSort(option.value)}
            className={cn(
              "flex items-center justify-between",
              option.value === currentSort && "bg-accent",
            )}
          >
            {option.label}
            {option.value === currentSort && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

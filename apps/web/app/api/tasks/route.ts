import { NextResponse } from "next/server";
import { tasks, compareValues } from "@/lib/mockData";

function normalize(s: string) {
  return s.toLowerCase();
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q");
  const sort = (url.searchParams.get("sort") as "id" | "name" | null) ?? null;
  const order = (url.searchParams.get("order") as "asc" | "desc" | null) ?? "asc";

  let result = tasks.slice();

  if (q && q.trim()) {
    const qq = normalize(q);
    result = result.filter(
      (t) => normalize(t.name).includes(qq) || normalize(t.description).includes(qq),
    );
  }

  if (sort) {
    result.sort((a, b) => compareValues(a, b, sort, order));
  }

  return NextResponse.json(result);
}

import { QuantumSystemState } from "@/lib/quantum-engine";

const getUserId = () => {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem("quantum_user_id");
  if (!id) {
    id = "q_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("quantum_user_id", id);
  }
  return id;
};

export async function fetchQuantumState(): Promise<QuantumSystemState> {
  const res = await fetch("/api/quantum", {
    headers: { "x-user-id": getUserId() }
  });
  if (!res.ok) throw new Error("Failed to fetch quantum state");
  return res.json();
}

export async function updateQuantumState(action: "OBSERVE" | "REFLECT" | "RESET"): Promise<QuantumSystemState> {
  const res = await fetch("/api/quantum", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": getUserId()
    },
    body: JSON.stringify({ action }),
  });
  if (!res.ok) throw new Error("Failed to update quantum state");
  return res.json();
}

import { useApi } from "@/lib/api";
import AddTransaction from "./AddTransaction";
import BulkAddTransactions from "./BulkAddTransactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function TwoAddTransactions() {
  const makeRequest = useApi();

  async function singleAdd(payload: {
    amountCents: number;
    date: string;
    description?: string | null;
  }) {
    await makeRequest("transactions/create-transaction", {
      method: "POST",
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        toast(JSON.stringify(data, null, 2));
      });
  }

  async function bulkAdd(formData: FormData) {
    const res = await makeRequest("transactions/bulk-transaction-add", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.detail || "Upload failed");
    }

    const data = await res.json();
    toast.success(JSON.stringify(data, null, 2));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Transactions (x2)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <BulkAddTransactions onUpload={bulkAdd} />
          </div>
          <div className="flex-1">
            <AddTransaction onSubmit={singleAdd} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

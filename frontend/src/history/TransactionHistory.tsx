import { useEffect, useState } from "react";
import { useApi } from "../utils/api";

type Transaction = {
  id: number;
  amount: number;
  date: string;
  user_id: string;
  description: string;
};

const formatISODate = (d: Date) => d.toISOString().split("T")[0];

export const TransactionHistory = () => {
  const [transactions, setTrasactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const makeRequest = useApi();

  // default dates: end = today, start = 30 days before
  const end = new Date();
  const thirtyDaysBefore = new Date();
  thirtyDaysBefore.setDate(end.getDate() - 30);

  const [endDate, setEndDate] = useState<string>(formatISODate(end));
  const [startDate, setStartDate] = useState<string>(
    formatISODate(thirtyDaysBefore)
  );

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await makeRequest(
          `transactions/get-transactions?start_date=${startDate}&end_date=${endDate}`
        );
        const data: Transaction[] = await response.json();
        setTrasactions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [startDate, endDate]);

  // When endDate changes, automatically reset startDate to 30 days before.
  const handleEndDateChange = (value: string) => {
    setEndDate(value);

    const newEnd = new Date(value);
    const newStart = new Date(newEnd);
    newStart.setDate(newEnd.getDate() - 30);

    setStartDate(formatISODate(newStart));
  };

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {/* Date selectors */}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Start Date:{" "}
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              if (e.target.value) setStartDate(e.target.value);
            }}
          />
        </label>
        <label style={{ marginLeft: "1rem" }}>
          End Date:{" "}
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              if (e.target.value) handleEndDateChange(e.target.value);
            }}
          />
        </label>
      </div>

      {/* Transactions table */}
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>ID</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Amount</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Date</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              User ID
            </th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {tx.id}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                ${tx.amount.toFixed(2)}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {new Date(tx.date).toLocaleDateString()}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {tx.user_id}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {tx.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

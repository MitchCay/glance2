import { useState } from "react";
import { useApi } from "../utils/api";
import { formatISODate } from "../utils/utils";

type Transaction = {
  amount: number;
  date: string;
  description?: string;
};

export const EditTransactions = () => {
  const makeRequest = useApi();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Transaction>({
    amount: 0,
    date: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.date) {
      alert("Amount and date are required.");
      return;
    }

    try {
      console.log(formData);
      formData.date = formatISODate(new Date(formData.date));
      console.log(formData);
      await makeRequest(`transactions/create-transaction`, {
        method: "POST",
        body: { amount: formData.amount },
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
      setShowForm(false);
      setFormData({ amount: 0, date: "", description: "" });
    } catch (error) {
      console.error("Failed to submit transaction:", error);
    }
  };

  return (
    <div>
      <button onClick={() => setShowForm(true)}>Add Transaction</button>

      {showForm && (
        <div className="modal">
          <form onSubmit={handleSubmit} className="modal-content">
            <h2>Add Transaction</h2>

            <label>
              Amount:
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Date:
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Description:
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </label>

            <div className="modal-actions">
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

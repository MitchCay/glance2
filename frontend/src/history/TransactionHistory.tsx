import { useEffect, useState } from "react";
import {useApi} from "../utils/api"

type Transactions = {
  id: Number;
  amount: Number;
  date: Date;
  user_id: String;
  description: String;
};

type TransactionData = {
  transactions: Transactions | null;
};

export function TransactionHistory() {
  const [transactions, setTrasactions] = useState<TransactionData>()
  const makeRequest = useApi()

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const data = await makeRequest("transactions")
      setTrasactions(data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
        {transactions?.transactions?.user_id || "none"}
    </div>
  );
}

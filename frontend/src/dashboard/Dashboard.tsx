import { useState } from "react";
import {useApi} from "../utils/api"

export function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [responseString, setResponseString] = useState<string|null>(null);
  const makeRequest = useApi()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    // test a "uploadfile" endpoint
    const response = await makeRequest("transactions/uploadfile",{
      method: "POST",
      body: formData
    })

    console.log(response)
  };

  const testRoute = async () => {
    const response = await makeRequest("transactions/test-route")
    console.log(response)
    setResponseString(response.user_id)
  }

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept=".csv"
        onChange={(event) => {
          setFile(event.target.files?.[0] || null);
        }}
        className="block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100"
      />
      {file && (
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      )}
    </form>


    
    <button onClick={testRoute}>
      /test-route
    </button>
    {responseString && (
      <p>{responseString}</p>
    )}
    </div>
  );
}

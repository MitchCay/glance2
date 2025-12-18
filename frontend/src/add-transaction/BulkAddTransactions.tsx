import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
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
import { toast } from "sonner";

// allow many common bank statement filetypes; validate presence and size (<50MB)
const schema = z.object({
  file: z
    .any()
    .refine((v) => v && v.length > 0 && v[0] instanceof File, {
      message: "Please select a file",
    })
    .refine((v) => {
      const f: File = v[0];
      return f.size <= 50 * 1024 * 1024; // 50MB
    }, { message: "File is too large (max 50MB)" }),
});

type FormValues = z.infer<typeof schema>;

export default function BulkAddTransactions({
  onUpload,
}: {
  onUpload?: (result: any) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const watchedFile = watch("file");
  const fileName = watchedFile && watchedFile.length > 0 ? watchedFile[0].name : "No file selected";

  const chooseFile = () => inputRef.current?.click();

  const onSubmit = async (values: FormValues) => {
    const fileList = values.file as unknown as FileList;
    const file = fileList[0];
    if (!file) return;

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file, file.name);

      if (onUpload) onUpload(form);
      else {
        console.log("File to upload:", file);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const { ref: registerFileRef, ...fileRegister } = register("file");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Upload Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-4 w-full max-w-md"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Field>
            <FieldLabel>
              <Label>CSV File</Label>
            </FieldLabel>
            <FieldContent>
              <div>
                <div>
                  <Input readOnly value={fileName} />
                  <input
                    {...fileRegister}
                    ref={(el) => {
                      registerFileRef(el);
                      inputRef.current = el;
                    }}
                    type="file"
                    accept=".csv,.pdf,.xls,.xlsx,.xlsm,.xlsb,.ods,.tsv,.txt"
                    className="hidden"
                  />
                </div>

                <div className="flex gap-2 mt-3">
                  <Button type="button" className="flex-1" onClick={chooseFile}>
                    Choose File
                  </Button>
                  <Button type="submit" className="flex-1" disabled={uploading}>
                    {uploading ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              </div>
              <FieldError
                errors={[
                  errors.file && { message: (errors.file as any).message },
                ]}
              />
            </FieldContent>
          </Field>
        </form>
      </CardContent>
    </Card>
  );
}

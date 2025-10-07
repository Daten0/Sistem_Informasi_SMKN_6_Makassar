import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Nama jurusan tidak boleh kosong").max(100),
  label: z.string().min(1, "Label jurusan tidak boleh kosong").max(100),
});

const AddSubject = () => {
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      label: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    toast.success("Jurusan berhasil ditambahkan", {
      description: `${values.label} - ${values.name}`,
    });
    navigate("/admin/materials");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="bg-card rounded-2xl shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            TAMBAH JURUSAN
          </h1>
        </div>

        {/* Form Card */}
        <div className="flex justify-center">
          <div className="bg-card rounded-2xl shadow-lg p-8 w-full max-w-lg">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-bold">NAMA JURUSAN</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="" 
                          {...field} 
                          className="h-12 bg-muted"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-bold">LABEL JURUSAN</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="" 
                          {...field} 
                          className="h-12 bg-muted"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-center pt-4">
                  <Button 
                    type="submit" 
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-12"
                  >
                    SIMPAN
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubject;

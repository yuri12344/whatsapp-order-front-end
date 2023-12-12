"use client";

import { axios } from "@/lib/axios";
import * as z from "zod";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { Heading } from "@/components/heading";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";

import { formSchema } from "./constants";

interface ConversationPageProps {
  caption: string;
  image: string;
}

const ConversationPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<ConversationPageProps[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("onSubmit called", values.image);

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64string = reader.result as string;
      console.log("Base64 str: ", base64string);
    };
    if (values.image instanceof File || values.image instanceof Blob) {
      reader.readAsDataURL(values.image);
    } else {
      console.error("No valid file provided");
    }

    try {
      const userMessage: ConversationPageProps = {
        caption: "",
        image: "",
      };
      const newMessages = [...messages, userMessage];

      const response = await axios.post("/api/conversations", {
        messages: newMessages,
      });

      setMessages((current) => [...current, userMessage, response.data]);
      form.reset();
    } catch (error: any) {
      toast.error("Something went wrong");
      console.log("[CONVERSATION_ERROR] ", error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Enviar mensagem no whatsapp"
        description="Envie mensagens no whatsapp para seus clientes."
        Icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6
                            focus-withing:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="image"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={isLoading}
                      id="image"
                      type="file"
                      accept="image/*" // Aceita apenas arquivos de imagem
                      {...field}
                    />
                  </FormItem>
                )}
              />

              <FormField
                name="caption"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        id="caption"
                        placeholder="Insira o caption da imagem"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                onClick={() => onSubmit(form.getValues())}
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
                type="submit"
              >
                Enviar
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}

          {messages.length == 0 && !isLoading && (
            <Empty label="Nenhuma mensagem enviada" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;

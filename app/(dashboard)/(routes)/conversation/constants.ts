import * as z from "zod";

export const formSchema = z.object({
  caption: z.string().optional(),
  image: z.instanceof(File),
});

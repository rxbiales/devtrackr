"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Plus, Briefcase, Building2, Globe, Monitor, CalendarIcon, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { createJob } from "@/services/jobServices"


const formSchema = z.object({
  job_title: z.string().min(2, "O título deve ter pelo menos 2 caracteres"),
  company: z.string().min(2, "A empresa é obrigatória"),
  status: z.string(),
  work_mode: z.enum(["Presencial", "Remoto", "Híbrido"]),
  platform: z.string().optional(),
  applied_date: z.date({
  error: "A data de aplicação é obrigatória.",
  }),
  curriculum_id: z.string().min(1, "Selecione um currículo"),
})

export function AddJobDialog() {
  const availableCurriculums = [
    { id: "1", name: "Currículo Fullstack English" },
    { id: "2", name: "Currículo Frontend English" },
    { id: "3", name: "Currículo Fullstack Português" },
    { id: "4", name: "Currículo Frontend Português" },

  ]

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      job_title: "",
      company: "",
      status: "Aplicado", 
      work_mode: "Remoto",
      platform: "",
      applied_date: new Date(), 
      curriculum_id: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      ...values,
      applied_date: values.applied_date.toISOString(),
      curriculum_id: Number(values.curriculum_id)
    }
    console.log("Enviando para o backend:", payload)
    createJob(payload)
      .then((response) => {
        console.log("Vaga criada com sucesso:", response)
        form.reset() 
      })
      .catch((error) => {
        console.error("Erro ao criar vaga:", error)
      })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-sm font-semibold">
          <Plus className="h-4 w-4" /> Nova Vaga
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Oportunidade</DialogTitle>
          <DialogDescription>O status inicial será definido como "Aplicado".</DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="job_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Briefcase className="h-3.5 w-3.5 text-muted-foreground" /> Cargo</FormLabel>
                    <FormControl><Input placeholder="Ex: Engenheiro de Software" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5 text-muted-foreground" /> Empresa</FormLabel>
                    <FormControl><Input placeholder="Ex: Vercel" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="work_mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Monitor className="h-3.5 w-3.5 text-muted-foreground" /> Modelo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Presencial">Presencial</SelectItem>
                        <SelectItem value="Remoto">Remoto</SelectItem>
                        <SelectItem value="Híbrido">Híbrido</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="applied_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col mt-auto">
                    <FormLabel className="flex items-center gap-2 mb-2"><CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" /> Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Selecione</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="curriculum_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><FileText className="h-3.5 w-3.5 text-muted-foreground" /> Currículo Utilizado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um currículo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableCurriculums.map((curr) => (
                        <SelectItem key={curr.id} value={curr.id}>{curr.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><Globe className="h-3.5 w-3.5 text-muted-foreground" /> Plataforma / Link</FormLabel>
                  <FormControl><Input placeholder="Ex: LinkedIn, Gupy" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full mt-4 font-bold py-6 text-lg">
              Registrar Candidatura
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
import axios from "axios";

interface WorkflowIntermediateOutputs {
  bot_response: string;
}

interface WorkflowInputs {
  thread_id: string;
  user_email: string;
  user_message: string;
}

interface PlombRunWorkflowRequest {
  inputs: WorkflowInputs;
}

interface PlombRunWorkflowResponse {
  execution_id: string;
}

interface PlombExecutionResultResponse {
  status:
    | "pending"
    | "completed"
    | "started"
    | "delayed"
    | "cancelled"
    | "failed";
  outputs?: Record<string, string>;
  intermediate_outputs?: WorkflowIntermediateOutputs;
  error?: string;
}

export class PlombService {
  private workflowUrl: string;
  private apiKey: string;

  constructor() {
    this.workflowUrl = process.env.PLOMB_WORKFLOW_URL!;
    this.apiKey = process.env.PLOMB_API_KEY!;
  }

  private get headers() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  private getExecutionResultUrl(executionId: string) {
    return `${this.workflowUrl}/executions/${executionId}`;
  }

  async runWorkflow(data: PlombRunWorkflowRequest): Promise<string> {
    try {
      const response = await axios.post<PlombRunWorkflowResponse>(
        this.workflowUrl,
        data,
        {
          headers: this.headers,
          timeout: 40000,
        },
      );

      if (response.status !== 200) {
        throw new Error(`Plomb execution failed: ${response.status}`);
      }

      const executionId = response.data.execution_id;

      return executionId;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to execute AI workflow: ${errorMessage}`);
    }
  }

  async getExecutionResults(
    executionId: string,
  ): Promise<PlombExecutionResultResponse> {
    try {
      const response = await axios.get<PlombExecutionResultResponse>(
        this.getExecutionResultUrl(executionId),
        {
          headers: this.headers,
          timeout: 10000,
        },
      );

      if (response.status !== 200) {
        throw new Error(`Failed to get results: ${response.status}`);
      }

      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to get AI results: ${errorMessage}`);
    }
  }

  async waitForCompletion(
    executionId: string,
    maxAttempts = 3,
    delayMs = 3000,
  ): Promise<PlombExecutionResultResponse> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await this.getExecutionResults(executionId);

        if (result.status === "completed") {
          return result;
        }

        if (result.status === "failed") {
          throw new Error(result.error || "Workflow execution failed");
        }

        if (attempt < maxAttempts) {
          await this.delay(delayMs);

          delayMs = Math.min(delayMs * 1.2, 5000);
        }
      } catch (error) {
        if (attempt === maxAttempts) {
          throw error;
        }
        await this.delay(1000);
      }
    }

    throw new Error("Timeout waiting for AI response");
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async processMessage(
    threadId: string,
    userEmail: string,
    message: string,
  ): Promise<string> {
    try {
      const executionId = await this.runWorkflow({
        inputs: {
          thread_id: threadId,
          user_email: userEmail,
          user_message: message,
        },
      });

      const result = await this.waitForCompletion(executionId);

      const aiResponse =
        result.intermediate_outputs?.bot_response ??
        "Lo siento, no pude procesar tu mensaje.";

      return aiResponse;
    } catch (error) {
      return this.getFallbackResponse();
    }
  }

  private getFallbackResponse(): string {
    const fallbacks = [
      "Disculpa, estoy experimentando dificultades técnicas. ¿Podrías repetir tu pregunta?",
      "Lo siento, no pude procesar tu mensaje en este momento. Un agente humano te contactará pronto por correo.",
      "Estoy teniendo problemas para responder. Mientras tanto, puedes enviar un email a soporte@miempresa.com",
    ];

    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}

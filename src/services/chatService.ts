/**
 * @file chatService.ts
 * @description 包含处理聊天流式响应的逻辑。
 */

export type OnTokenCallback = (chunk: string) => void;
export type OnCompleteCallback = (finalText: string) => void;
export type OnErrorCallback = (error: Error) => void;

interface StreamChatResponseParams {
  promptContent: string;
  sessionId: string;
  serviceId: string; // 新增
  onToken: OnTokenCallback;
  onComplete: OnCompleteCallback;
  onError: OnErrorCallback;
}

/**
 * 处理聊天流式响应。
 * @param {StreamChatResponseParams} params - 包含提示内容、会话ID和回调函数的参数对象。
 */
export const streamChatResponse = async ({
  promptContent,
  sessionId,
   serviceId, // 新增
  onToken,
  onComplete,
  onError,
}: StreamChatResponseParams) => {
  let accumulatedText = '';
  let buffer = '';

  try {
    const response = await fetch('http://127.0.0.1:8888/service_run_stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: serviceId,
        params: {
          input: promptContent,
          session_id: sessionId,
        },
        saved: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (!response.body) {
      throw new Error('Response body is null, cannot stream.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        console.log('Stream finished.');
        onComplete(accumulatedText);
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim().startsWith('data:')) {
          try {
            const jsonString = line.trim().substring(5);
            const parsedData = JSON.parse(jsonString);

            if (parsedData.process && parsedData.process.type === 'token') {
              const chunkText = parsedData.process.data.chunk.text;
              if (chunkText) {
                accumulatedText += chunkText;
                onToken(chunkText);
              }
            } else if (parsedData.result) {
              const finalResult = JSON.parse(parsedData.result);
              console.log('Final result with metadata:', finalResult);
              // 如果 finalResult.output.text 包含最终完整内容，可以在这里更新 accumulatedText
              // 例如：accumulatedText = finalResult.output.text;
            }
          } catch (e) {
            console.error('Failed to parse JSON line:', line, e);
          }
        }
      }
    }
  } catch (error: any) {
    console.error('Streaming fetch error:', error);
    onError(error);
  }
};

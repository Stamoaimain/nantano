import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { AWS_REGION } from "@/lib/db/client";

/**
 * Claude Sonnet reached through a cross-region inference profile (the `us.`
 * prefix). Bedrock only accepts the profile id - not the bare model id - for
 * on-demand throughput in us-east-1.
 */
export const DEFAULT_MODEL_ID = "us.anthropic.claude-sonnet-4-5-20250929-v1:0";

let cached: ReturnType<typeof createAmazonBedrock> | undefined;

/**
 * The AI SDK Bedrock provider signs requests with SigV4 over plain `fetch`
 * (via aws4fetch) instead of wrapping the AWS SDK. That keeps the serverless
 * bundle small and lets the route run on any runtime.
 */
function getProvider(): ReturnType<typeof createAmazonBedrock> {
  if (cached) return cached;

  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  cached = createAmazonBedrock({
    region: AWS_REGION,
    // Explicit keys for local development; otherwise the standard AWS chain,
    // which resolves the Amplify compute role (or any instance role) in prod.
    ...(accessKeyId && secretAccessKey
      ? { accessKeyId, secretAccessKey, sessionToken: process.env.AWS_SESSION_TOKEN }
      : { credentialProvider: defaultProvider() }),
  });

  return cached;
}

export function getChatModel() {
  return getProvider()(process.env.BEDROCK_MODEL_ID ?? DEFAULT_MODEL_ID);
}

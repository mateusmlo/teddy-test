import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeSDK } from '@opentelemetry/sdk-node';
import * as process from 'process';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus'
import { JaegerExporter } from '@opentelemetry/exporter-jaeger'

export const otelSDK = new NodeSDK({
  metricReader: new PrometheusExporter({
    port: 8081,
  }),
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: `teddy-dev`,
  }),
  spanProcessor: new SimpleSpanProcessor(new JaegerExporter()),
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new NestInstrumentation(),
  ],
});

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  otelSDK
    .shutdown()
    .then((err) => console.log('Error shutting down SDK', err))
    .finally(() => process.exit(0));
});

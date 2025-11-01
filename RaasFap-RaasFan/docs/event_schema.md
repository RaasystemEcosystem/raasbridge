# RaasGenai EventBridge Canonical Event Schema

All events published to EventBridge/Kinesis should follow this template:

```json
{
  "version": "1.0",
  "id": "<uuid>",
  "source": "raasystem.<module>",         // e.g., raasystem.rabex
  "detail-type": "<EventName>",           // e.g., Trade.Executed
  "time": "<ISO8601>",
  "region": "us-east-1",
  "detail": { }                           // module-specific payload
}

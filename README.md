A GitHub Action to easily send the result of a health check to the [Service Catalog](https://github.com/clearwind-ca/service-catalog) server. This works in conjunction with [Get Payload](https://github.com/marketplace/actions/service-catalog-get-payload)

## Usage

```yaml
    - uses: clearwind-ca/send-payload@v1
      env:
        SERVICE_CATALOG_TOKEN: ${{ secrets.SERVICE_CATALOG_TOKEN }}
```

With `get-payload`:

```yaml
    - uses: clearwind-ca/get-payload@v1
    # Do something with the payload
    - uses: clearwind-ca/send-payload@v1
      env:
        SERVICE_CATALOG_TOKEN: ${{ secrets.SERVICE_CATALOG_TOKEN }}
```

## Required secrets

This secret must exist so that it can authenticate with the Service Catalog.

|Name|Required|Value|
|-|-|-|
|`SERVICE_CATALOG_TOKEN`|Yes|A valid API token for your Service Catalog server|

## Inputs

|Name|Required|Default|Value|
|-|-|-|-|
|`result_file`|No|`/tmp/service-catalog-result.json`|Path to the result file|
|`payload_file`|No|`/tmp/service-catalog-payload.json`|The payload from the repository dispatch, as created by [Get Payload](https://github.com/marketplace/actions/service-catalog-get-payload)|

If `payload_file` and `result_file` are not specified, then they will use the defaults above.

The `payload_file` is the result of using `get-payload` and will place the payload in the correct place for this Action to consume.

## Example file:

```JSON
{"result": "pass", "message": "This health check passed perfectly, well done."}
```
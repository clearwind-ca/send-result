A GitHub Action to easily send the result of a health check to the [Service Catalog](https://github.com/clearwind-ca/service-catalog) server. This works in conjunction with [Get Payload](https://github.com/marketplace/actions/service-catalog-get-payload)

## Usage

```yaml
    - uses: clearwind-ca/get-payload@v1
    # Do something with the payload
    # Assumes that the result will be in /tmp/service-catalog-payload.json
    - uses: clearwind-ca/send-payload@v1
      env:
        SERVICE_CATALOG_TOKEN: ${{ secrets.SERVICE_CATALOG_TOKEN }}
```

With inputs:

```yaml
    - uses: clearwind-ca/get-payload@v1
    # Do something with the payload
    # Assumes that the result will be in /tmp/service-catalog-payload.json
    - uses: clearwind-ca/send-result@inputs
      env:
        SERVICE_CATALOG_TOKEN: ${{ secrets.SERVICE_CATALOG_TOKEN }}
      with:
        result: "fail"
        message: "this didn't work out i'm afraid"
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

If the `result_file` is not specified and the default file is not present then it will use the following inputs will be used.

|Name|Required|Default|Value|
|-|-|-|-|
|`result`|No||The result to send to the service catalog, `pass` or `fail`|
|`message`|No||Text to explain the reason for the failure in more detail|


## Example file:

```JSON
{"result": "pass", "message": "This health check passed perfectly, well done."}
```
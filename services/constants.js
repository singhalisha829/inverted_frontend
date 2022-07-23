export const URL=process.env.SERVER;

export const MAIN={
    PARTS:'api/v1/part/',
    LOGIN:'api-token-auth/',
    VENDOR:'api/v1/vendor/',
    UNIT:'api/v1/unit/',
    LEDGER_BY_PARTID:'api/v1/inventory/ledger/?part_id=',
    LEDGER:'api/v1/inventory/ledger/',
    PART_BY_PARTID:'api/v1/part/?part_id=',
    PART_BY_ID:'api/v1/part/',
    PART_TYPE:'api/v1/part-type/',
    PURCHASE_ORDER:'api/v1/purchase-order/',
    BOM:'api/v1/bom',
    PART_WISE_LIST:'api/v1/purchase-order-items-wise/?production_order_id=',
    PO_VENDOR:'api/v1/purchase-order-items-vendor/',
    VENDOR_WISE_LIST:'api/v1/vendor-purchase-order/?purchase_order_id=',
    PRODUCTION_ORDER:'api/v1/production-order/',
    UNIT_CONVERSION:'api/v1/unit-conversion/?required_symbol=',
    PO_VENDOR1:'api/v1/purchase-order-items-vendor1/',
    DELETE_PART:'api/v1/purchase-order-items-vendor-delete/',


}
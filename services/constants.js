export const URL=process.env.SERVER;

export const MAIN={
    PART:'api/v1/part/',
    LOGIN:'api-token-auth/',
    VENDOR:'api/v1/vendor/',
    UNIT:'api/v1/unit/',
    LEDGER_BY_PARTID:'api/v1/inventory-ledger/?part_id=',
    LEDGER:'api/v1/inventory-ledger/',
    PART_BY_PARTID:'api/v1/part/?part_id=',
    PART_TYPE:'api/v1/part-type/',
    PURCHASE_ORDER:'api/v1/purchase-order/',
    BOM:'api/v1/bom',
    PURCHASE_ORDER_PART_WISE_LIST:'api/v1/purchase-order-items-wise/?purchase_order_id=',
    PO_VENDOR:'api/v1/purchase-order-items-vendor/',
    VENDOR_WISE_LIST:'api/v1/vendor-purchase-order/',
    PRODUCTION_ORDER:'api/v1/production-order/',
    UNIT_CONVERSION:'api/v1/unit-conversion/?required_symbol=',
    PO_VENDOR1:'api/v1/purchase-order-items-vendor1/',
    DELETE_PART:'api/v1/purchase-order-items-vendor-delete/',
    PRODUCTION_ORDER_PART_WISE_LIST:'api/v1/production-order-part-wise/?production_order_id=',
    PRODUCTION_ORDER_TRANSACTION:'api/v1/production-order-transction/',
    PO_PDF:'api/v1/vendor_purchase_order_pdf/?id=',
    DROPDOWN_PARTS:'api/v1/dropdown/parts/',
    DROPDOWN_UNIT:'api/v1/dropdown/unit/?unit_type='

}
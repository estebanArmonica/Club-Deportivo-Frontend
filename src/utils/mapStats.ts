// src/utils/mapStats.ts
export interface LabelTotal {
    label: string;
    total: number;
}

/**
 * Normaliza una lista de pares [label, total] (o { label, total })
 * que devuelve el backend como List<Object[]>.
 */
export const mapObjectArrayToLabelTotal = (
    arr: any[] | undefined
): LabelTotal[] =>
    (arr ?? []).map((item) =>
        Array.isArray(item)
            ? { label: String(item[0]), total: Number(item[1]) }
            : {
                  label: String(item.label ?? item[0]),
                  total: Number(item.total ?? item[1]),
              }
    );
export type TGigsFilterQuery = {
  price?: {
    $gte?: string;
    $lte?: string;
  };
  $text?: {
    $search: string;
    $caseSensitive: boolean;
    $diacriticSensitive: boolean;
  };
};

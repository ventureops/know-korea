const PRESETS = {
  cover:  "f_auto,q_auto,w_1200",
  card:   "f_auto,q_auto,w_600",
  body:   "f_auto,q_auto,w_800",
  avatar: "f_auto,q_auto,w_200,h_200,c_fill",
  og:     "f_auto,q_auto,w_1200,h_630,c_fill",
} as const;

export type CloudinaryPreset = keyof typeof PRESETS;

/** Cloudinary URL에 변환 파라미터 삽입. 외부 URL은 그대로 반환. */
export function cloudinaryUrl(
  src: string | null | undefined,
  preset: CloudinaryPreset
): string {
  if (!src) return "";
  if (!src.includes("res.cloudinary.com")) return src;
  return src.replace("/upload/", `/upload/${PRESETS[preset]}/`);
}

/** body HTML 내 Cloudinary img src를 body 프리셋으로 변환 */
export function optimizeBodyImages(html: string): string {
  return html.replace(
    /(src=")(https:\/\/res\.cloudinary\.com\/[^"]+\/image\/upload\/)([^"]+)(")/g,
    `$1$2${PRESETS.body}/$3$4`
  );
}

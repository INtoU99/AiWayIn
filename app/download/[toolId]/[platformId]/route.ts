import { getDirectDownload } from "@/data/downloads";

type DownloadRouteContext = { params: Promise<{ toolId: string; platformId: string }> };

export async function GET(_request: Request, { params }: DownloadRouteContext) {
  const { toolId, platformId } = await params;
  const download = getDirectDownload(toolId, platformId);

  if (!download) {
    return Response.json({ error: "没有找到对应的官方下载文件" }, { status: 404 });
  }

  return Response.redirect(download.officialUrl, 302);
}

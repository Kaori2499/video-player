import type { Player } from "@component-template/react";
import { useEffect, useState } from "react";

type ArchiveMetadataResponse = {
  metadata?: {
    title?: string;
    description?: string;
    date?: string;
  };
  files?: Array<{
    name: string;
    format?: string;
    size?: string;
  }>;
};

const LOCAL_DEMO_VIDEO: Player.Video = {
  url: import.meta.env.BASE_URL + "videoplayback.mp4",
  metadata: {
    title: "videoplayback",
    description: "Local sample served from the playground public folder.",
  },
};

const ARCHIVE_ITEMS = [
  {
    identifier: "cosmos-laundromat-first-cycle",
    label: "Internet Archive",
  },
  { identifier: "Big_Buck_Bunny", label: "Internet Archive" },
  { identifier: "ElephantsDream", label: "Internet Archive" },
  { identifier: "Sintel", label: "Internet Archive" },
] as const;

const REMOTE_FALLBACK_VIDEOS: Player.Video[] = [
  {
    url: "https://archive.org/download/cosmos-laundromat-first-cycle/Cosmos%20Laundromat%20-%20First%20Cycle.mp4",
    metadata: {
      title: "Cosmos Laundromat: First Cycle",
      description:
        "Blender Foundation open short (1080p). Bright alpine meadow opening.",
      date: "2015",
      links: [
        {
          label: "Blender",
          href: "https://www.blender.org/about/projects/cosmos-laundromat/",
        },
      ],
    },
  },
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    metadata: {
      title: "Big Buck Bunny",
      description: "Blender Foundation open movie (fallback stream).",
      date: "2008",
      links: [
        {
          label: "Blender",
          href: "https://peach.blender.org/",
        },
      ],
    },
  },
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    metadata: {
      title: "Elephants Dream",
      description: "Blender Foundation open movie (fallback stream).",
      date: "2006",
    },
  },
];

/** Local sample is ~300MB; keep it last so the default preview stays lightweight. */
function withLocalDemoLast(videos: Player.Video[]): Player.Video[] {
  return [...videos, LOCAL_DEMO_VIDEO];
}

function pickMp4File(files: ArchiveMetadataResponse["files"]) {
  if (!files?.length) {
    return undefined;
  }

  const mp4Files = files.filter((file) => {
    const name = file.name.toLowerCase();
    return (
      name.endsWith(".mp4") &&
      !name.includes("512kb") &&
      !name.includes("mpeg4")
    );
  });

  mp4Files.sort(
    (a, b) =>
      Number.parseInt(b.size ?? "0", 10) - Number.parseInt(a.size ?? "0", 10),
  );

  return mp4Files[0]?.name;
}

async function fetchArchiveVideo(
  identifier: string,
  archiveLabel: string,
): Promise<Player.Video | null> {
  const response = await fetch(`https://archive.org/metadata/${identifier}`);
  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as ArchiveMetadataResponse;
  const fileName = pickMp4File(data.files);
  if (!fileName) {
    return null;
  }

  return {
    url: `https://archive.org/download/${identifier}/${encodeURIComponent(fileName)}`,
    metadata: {
      title: data.metadata?.title,
      description: data.metadata?.description,
      date: data.metadata?.date,
      links: [
        {
          label: archiveLabel,
          href: `https://archive.org/details/${identifier}`,
        },
      ],
    },
  };
}

async function loadDemoVideos(): Promise<Player.Video[]> {
  const results = await Promise.all(
    ARCHIVE_ITEMS.map((item) =>
      fetchArchiveVideo(item.identifier, item.label),
    ),
  );

  const videos = results.filter(
    (item): item is Player.Video => item !== null,
  );
  const remote =
    videos.length > 0 ? videos : REMOTE_FALLBACK_VIDEOS;
  return withLocalDemoLast(remote);
}

export function useDemoVideos() {
  const [videos, setVideos] = useState<Player.Video[]>(REMOTE_FALLBACK_VIDEOS);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("ready");

  useEffect(() => {
    let cancelled = false;

    loadDemoVideos()
      .then((items) => {
        if (!cancelled) {
          setVideos(items);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setVideos(withLocalDemoLast(REMOTE_FALLBACK_VIDEOS));
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { videos, status };
}

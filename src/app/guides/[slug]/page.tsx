import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { GUIDES } from "@/lib/guides-data";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) return {};
  return pageMetadata({
    title: guide.title,
    description: guide.excerpt,
    path: `/guides/${guide.slug}`,
    keywords: [guide.category.toLowerCase(), guide.title.toLowerCase(), "texture guide"],
  });
}

const CONTENT: Record<
  string,
  { intro: string; sections: Array<{ h2: string; p?: string[]; list?: string[]; code?: string }> }
> = {
  "what-is-a-tileable-texture": {
    intro:
      "A tileable texture is an image whose edges meet cleanly when it is repeated. Seamless and tileable describe the same property from different angles - tileable emphasizes that the texture repeats, seamless emphasizes that the boundary between copies is invisible. Once you understand what actually happens at that boundary, most texture problems become obvious.",
    sections: [
      {
        h2: "What happens at the boundary",
        p: [
          "When a texture repeats, every pixel on the right edge touches the left edge of the next copy, and every pixel on the bottom edge touches the top edge of the copy above. If those pairs do not match in colour, you get a visible line. If they match in colour but not in structure, you get something worse: a subtle but readable discontinuity.",
          "The second case is what makes naive texture fixing techniques fail. Offsetting the image and clone-stamping the seam removes the hard line, but the surrounding structure still lines up in a way that the eye picks up as a grid.",
        ],
        list: [
          "Hard seam: edge pixels differ - a visible line, easy to spot.",
          "Structural seam: colours match but the pattern direction breaks - the classic grid.",
          "Tonal seam: no line, but average brightness varies - a repeating checkerboard.",
        ],
      },
      {
        h2: "Why photographs rarely tile",
        p: [
          "A photograph contains lighting that only exists once. The centre is usually brighter than the corners because of the lens, and one edge may catch a shadow. When you tile that frame, that unique lighting becomes a repeating pattern, and the surface develops an obvious checkerboard that has nothing to do with the actual material.",
          "This is the single most common reason generated textures look wrong in a 3D scene, even when no seam is visible.",
        ],
      },
      {
        h2: "Periodic noise solves it at the source",
        p: [
          "The alternative is to never create a unique border in the first place. If the texture is defined by a mathematical function whose lattice wraps exactly at the tile boundary, then the left edge is the same function as the right edge by definition.",
          "Concretely: sample a noise function where the integer grid indices wrap modulo the period. Every octave inherits that wrapping, so the whole texture repeats with zero border at all. Structure stays crisp because nothing was blended or smeared.",
        ],
        code: `// Value noise with a wrapping lattice
const period = 8;
const xa = ((x0 % period) + period) % period;   // wraps
const xb = (xa + 1) % period;                   // wraps
// -> f(0) === f(1) by construction`,
      },
      {
        h2: "Choosing the right resolution",
        p: [
          "Texture resolution is a density decision, not a quality decision. A 1024px tile covering one square metre looks completely different from the same file covering four.",
        ],
        list: [
          "512px - mobile, distant surfaces, prototyping.",
          "1024px - the standard for most real-time surfaces.",
          "2048px - hero surfaces, close-up cinematics, architecture stills.",
          "4K and above - offline renders and large-format ArchViz stills.",
        ],
      },
      {
        h2: "Practical checks before you ship",
        list: [
          "Tile the preview at 3x3 or 4x4 and look for a grid forming at a distance.",
          "Squint at it - blur the image in your head. Grids show up at low frequency first.",
          "Rotate the surface 45 degrees and check again. Axis-aligned grids hide diagonally.",
          "Look at the surface at grazing angles, where repetition is most obvious.",
        ],
      },
    ],
  },
  "pbr-texture-workflow": {
    intro:
      "A PBR material is a set of maps that describe a surface independently of the light hitting it. Each channel answers one question. When those answers come from the same underlying height field, the material reads as a real surface instead of a collection of unrelated images.",
    sections: [
      {
        h2: "The five channels",
        p: [
          "Albedo is the base colour with no lighting baked in. Normal is tangent-space direction data describing surface bumps. Roughness describes how scattered the reflection is. Ambient occlusion describes contact darkening in creases. Height describes actual depth.",
          "The important detail is that normal, roughness, AO and height here are all derived from one height field. That is why the normal map lines up with the colour in the albedo, and why the AO darkens exactly the gaps you can see.",
        ],
        list: [
          "Albedo / BaseColor - pure colour, no lighting.",
          "Normal - tangent-space normals for bump response.",
          "Roughness - 0 is a mirror, 1 is fully diffuse.",
          "AO - baked contact shadowing in creases and gaps.",
          "Height / Displacement - real depth for parallax or displacement.",
        ],
      },
      {
        h2: "Roughness is the channel people get wrong",
        p: [
          "Roughness is the fastest way to make a material look fake, because default values are usually wrong for the surface. A brick wall should be rough everywhere. A glazed ceramic tile should be smooth on the face and rougher in the grout. Metal should be smooth but not perfect.",
          "If a surface has both raised and recessed areas, the roughness map should vary with them. Deriving roughness from the same height field that produced the normal map is the simplest way to keep that relationship believable.",
        ],
      },
      {
        h2: "Connecting the maps in an engine",
        p: [
          "In Unity URP, assign albedo to Base Map, the normal map to Normal Map, and the roughness value to Smoothness with an inversion if your pipeline expects it. Unreal Engine 5 uses the same convention with a Material Instance. Blender uses separate sockets on the Principled BSDF.",
        ],
        code: `Unity URP
  Base Map        <- albedo.png
  Normal Map      <- normal.png   (Normal Map checkbox ON)
  Smoothness      <- 1 - roughness.png   (or use a Mask Map)
  Occlusion       <- ao.png       (Occlusion checkbox ON)

Blender Principled BSDF
  Base Color      <- albedo.png
  Normal          <- normal.png
  Roughness       <- roughness.png
  Ambient Occlusion <- ao.png`,
      },
      {
        h2: "Keeping files aligned",
        p: [
          "Every map in a pack must be exported at exactly the same resolution, or the bumps will drift away from the colour detail. If you rescale one map, rescale all of them.",
        ],
      },
    ],
  },
  "texture-for-unity-unreal-blender": {
    intro:
      "Generating a texture is half the job. This guide covers the other half: getting it into Unity, Unreal Engine, Godot and Blender correctly, and hiding repetition on the large surfaces where it becomes obvious.",
    sections: [
      {
        h2: "The one setting that matters most",
        p: [
          "Every engine has a texture wrap mode, and it defaults to Clamp in most cases. With Clamp, tiling a texture stretches the edge pixels across the surface, which looks worse than no tiling at all. Set the wrap mode to Repeat and the texture tiles as expected.",
        ],
        list: [
          "Unity - Texture Inspector, Wrap Mode = Repeat.",
          "Unreal - Texture asset, Address X and Y = Wrap.",
          "Godot - CanvasItem or StandardMaterial3D, texture repeat flag on.",
          "Blender - Image Texture node, Extension = Repeat.",
        ],
        code: `three.js
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);`,
      },
      {
        h2: "Unity (URP and HDRP)",
        p: [
          "Create a material using the URP Lit shader, drag in the albedo, then assign the normal map and enable the Normal Map checkbox - a very common missed step that produces a flat-looking surface. Assign the AO map and enable Occlusion. For roughness, connect the map to the Smoothness slot through an invert if needed.",
          "Keep tiling in the Material Inspector Tiling fields rather than changing the texture import settings, so one material can be reused at different densities.",
        ],
      },
      {
        h2: "Unreal Engine 5",
        p: [
          "Create a Material Instance from a parent material that already wires the texture sample nodes. Set Address X and Y to Wrap on the texture asset itself. For large landscapes, a Landscape Layer Blend with two or three different variants of the same material breaks up repetition much better than a single tile.",
        ],
      },
      {
        h2: "Blender",
        p: [
          "Add an Image Texture node for each map and connect them to the corresponding Principled BSDF inputs. Use a Mapping node between the texture coordinate and each image texture so you can control the repeat once and apply it consistently across all five maps.",
        ],
        code: `Texture Coordinate -> Mapping (Scale 4,4,4) -> all 5 Image Texture nodes
Image Texture (Albedo)    -> Base Color
Image Texture (Normal)    -> Normal
Image Texture (Roughness) -> Roughness
Image Texture (AO)        -> Ambient Occlusion
Image Texture (Height)    -> (optional) Displacement`,
      },
      {
        h2: "Breaking up repetition",
        p: [
          "A perfectly seamless tile still becomes recognisable once it repeats dozens of times. Three techniques fix this cheaply.",
        ],
        list: [
          "Macro variation - a large-scale noise texture that modulates colour and roughness slowly.",
          "Detail normal - a high-frequency normal map applied at a different scale, which disrupts the eye's pattern recognition.",
          "Triplanar projection - for terrain and complex geometry, projects the texture by world position on all three axes to avoid stretching.",
          "Vertex colour blending - in UE5 landscapes, blend two material layers using painted vertex weights.",
        ],
      },
    ],
  },
  "texture-repetition-and-tiling-artifacts": {
    intro:
      "A seamless texture solves the seam problem. It does not solve the repetition problem. Once a tile repeats far enough, the human visual system learns the pattern and starts to see the grid - even though there is not a single visible seam anywhere.",
    sections: [
      {
        h2: "How repetition perception works",
        p: [
          "Low-frequency information dominates perception. When a pattern repeats, the brain compares distant copies and finds the correspondence. If the repeat distance is large, the grid is easy to spot. If the repeat distance is small and the contrast between copies is low, it disappears.",
          "This means the fix is not always higher resolution. It is often about lowering the contrast between copies while raising the frequency of the detail.",
        ],
      },
      {
        h2: "Macro variation noise",
        p: [
          "Multiply or overlay the albedo with a very large-scale noise texture, typically 4 to 16 times larger than the tiling texture itself. Because it does not repeat at the same rate, the surface gets large-scale tonal variation that breaks the grid without touching the fine detail.",
        ],
      },
      {
        h2: "Detail normals",
        p: [
          "A detail normal map applied at a much higher tiling rate - often 8 to 16 times the base texture - adds fine surface response that never lines up with the base pattern. It is the cheapest fix in real-time rendering and costs one extra texture sample.",
        ],
      },
      {
        h2: "Triplanar projection for terrain",
        p: [
          "On terrain and irregular geometry, standard UVs stretch on slopes. Triplanar projection samples the texture three times - once per axis - and blends by the surface normal. The result tiles without stretching, at the cost of three texture samples per map.",
        ],
      },
      {
        h2: "A quick self-check",
        list: [
          "Set the camera far away and look for a grid.",
          "Rotate the view 45 degrees - axis-aligned grids hide at 0 and 90 degrees.",
          "Walk through the scene. Movement reveals repetition far faster than a still frame.",
          "Check grazing angles, where perspective compresses the repeat into visible bands.",
        ],
      },
    ],
  },
};

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);
  const content = CONTENT[slug];

  if (!guide || !content) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-ink-900">Guide not found</h1>
        <Link
          href="/guides"
          className="mt-6 inline-flex rounded-xl bg-ink-900 px-5 py-3 text-sm font-bold text-white"
        >
          Back to guides
        </Link>
      </section>
    );
  }

  return (
    <>
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-xs font-medium text-ink-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-azure-600">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/guides" className="hover:text-azure-600">
                Guides
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-ink-700">{guide.category}</li>
          </ol>
        </nav>

        <h1 className="mt-5 text-balance font-display text-4xl font-bold leading-[1.12] tracking-tight text-ink-900">
          {guide.title}
        </h1>
        <p className="mt-3 text-sm font-medium text-ink-500">
          {guide.category} · {guide.readTime}
        </p>

        <p className="mt-7 text-base leading-relaxed text-ink-700">{content.intro}</p>

        {content.sections.map((s) => (
          <section key={s.h2} className="mt-10">
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink-900">{s.h2}</h2>
            {s.p && s.p.map((para) => (
              <p key={para.slice(0, 32)} className="mt-4 text-base leading-relaxed text-ink-700">
                {para}
              </p>
            ))}
            {s.list && (
              <ul className="mt-5 space-y-2.5">
                {s.list.map((item) => (
                  <li key={item} className="flex gap-3 text-base leading-relaxed text-ink-700">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sun-500" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
            {s.code && (
              <pre className="mt-5 overflow-x-auto rounded-xl bg-ink-900 p-5 text-sm leading-relaxed text-ink-100">
                <code>{s.code}</code>
              </pre>
            )}
          </section>
        ))}

        <div className="mt-14 rounded-2xl border border-azure-200 bg-azure-50 p-6">
          <h2 className="font-display text-xl font-bold text-ink-900">
            Try it on your own material
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-600">
            Generate a seamless PBR texture pack free in your browser. No upload, no watermark.
          </p>
          <Link
            href="/tools/ai-texture-generator"
            className="mt-4 inline-flex rounded-xl bg-ink-900 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-ink-700"
          >
            Open the generator
          </Link>
        </div>
      </article>
    </>
  );
}

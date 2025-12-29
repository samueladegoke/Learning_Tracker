import CodeBlock from '../../CodeBlock'
import { Lightbulb, Rocket, Target, Layers, ListChecks, AlertTriangle, MessageSquare, Star, Image, Palette, Save } from 'lucide-react'

export default function DeepDiveDay85() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-12">

                {/* 01. The Brief */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="text-amber-400">01.</span>
                        <Rocket className="w-6 h-6 text-amber-400" />
                        The Brief
                    </h2>
                    <div className="bg-surface-800/40 p-6 rounded-xl border border-surface-700/50 shadow-inner italic text-surface-200">
                        "Build a desktop GUI application that lets users upload images and apply text or image-based watermarks. Perfect for content creators protecting their visual assets."
                        <div className="mt-4 not-italic space-y-2">
                            <p className="font-bold text-white text-sm">Deliverables:</p>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                <li>Tkinter-based Desktop Interface</li>
                                <li>Pillow (PIL) integration for image manipulation</li>
                                <li>File selection dialogs (Open/Save)</li>
                                <li>Watermark customization (Opacity, Position, Text)</li>
                                <li>Live preview of the watermarked image</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 02. Architecture */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="text-amber-400">02.</span>
                        <Layers className="w-6 h-6 text-amber-400" />
                        System Architecture
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-surface-800/20 border border-surface-700/50">
                            <h4 className="font-bold text-white text-sm mb-2">Core Pattern</h4>
                            <p className="text-sm text-surface-300">Event-driven GUI pattern. User interactions trigger Pillow processing pipelines.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-surface-800/20 border border-surface-700/50">
                            <h4 className="font-bold text-white text-sm mb-2">Image Pipeline</h4>
                            <p className="text-sm text-surface-300">Input Image → Alpha Composite (Watermark) → Canvas Injection (Preview) → Jpeg/Png Export.</p>
                        </div>
                    </div>
                    <CodeBlock
                        code={`from PIL import Image, ImageDraw, ImageFont

def add_watermark(image_path, text):
    base = Image.open(image_path).convert("RGBA")
    txt = Image.new("RGBA", base.size, (255,255,255,0))
    d = ImageDraw.Draw(txt)
    d.text((10,10), text, fill=(255,255,255,128)) # Semi-transparent
    return Image.alpha_composite(base, txt)`}
                        language="python"
                    />
                </section>

                {/* 03. Milestones */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="text-amber-400">03.</span>
                        <ListChecks className="w-6 h-6 text-amber-400" />
                        Action Plan
                    </h2>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center text-amber-400 font-bold">1</div>
                            <div>
                                <h4 className="text-white font-bold">GUI Layout</h4>
                                <p className="text-sm text-surface-300">Design the main window with a large canvas for image display and a sidebar for controls.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center text-amber-400 font-bold">2</div>
                            <div>
                                <h4 className="text-white font-bold">Pillow Integration</h4>
                                <p className="text-sm text-surface-300">Convert Pillow images to ImageTk compatible objects for Tkinter display.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center text-amber-400 font-bold">3</div>
                            <div>
                                <h4 className="text-white font-bold">File IO</h4>
                                <p className="text-sm text-surface-300">Implement file dialogs for seamless opening and saving of user photos.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 04. Pitfalls */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="text-amber-400">04.</span>
                        <AlertTriangle className="w-6 h-6 text-amber-400" />
                        Common Pitfalls
                    </h2>
                    <div className="space-y-3">
                        <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                            <h4 className="font-bold text-red-400 text-sm">Large Image Lag</h4>
                            <p className="text-xs text-red-300/60 mt-1">4K images might freeze the UI during processing. Solution: Process a thumbnail for preview and full-res only on save.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                            <h4 className="font-bold text-red-400 text-sm">Transparency (Alpha)</h4>
                            <p className="text-xs text-red-300/60 mt-1">Forgetting to convert to 'RGBA' mode will cause solid background boxes behind your text watermarks.</p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                {/* Recommended Tech Stack */}
                <div className="bg-surface-800/30 p-6 rounded-2xl border border-surface-700/50 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-amber-400" /> Recommended Stack
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-700/30 border border-surface-600/30">
                            <Palette className="w-5 h-5 text-pink-400" />
                            <div>
                                <p className="text-xs font-bold text-white">Tkinter</p>
                                <p className="text-[10px] text-surface-400">Standard GUI Library</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-700/30 border border-surface-600/30">
                            <Image className="w-5 h-5 text-indigo-400" />
                            <div>
                                <p className="text-xs font-bold text-white">Pillow (PIL)</p>
                                <p className="text-[10px] text-surface-400">Image Manipulation</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interview Prep */}
                <div className="bg-surface-800/30 p-6 rounded-2xl border border-surface-700/50 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-amber-400" /> Interview Prep
                    </h3>
                    <div className="space-y-4 text-sm text-surface-300">
                        <div>
                            <p className="font-bold text-white mb-1">Pillow Core Library</p>
                            <p className="text-[11px] leading-relaxed">"What is the difference between alpha_composite and paste in Pillow?"</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-1">UI Performance</p>
                            <p className="text-[11px] leading-relaxed">"How do you keep the GUI responsive while performing heavy image processing?" (Expect: Threading or thumbnails)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

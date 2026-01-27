import { useEffect, useRef, useState } from "react";
import { Dialog, VisuallyHidden } from "radix-ui";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import "./style.css";

interface ImageViewerProps {
  src: string;
  alt: string;
}

export function ImageViewer({ src, alt }: ImageViewerProps) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);

  useEffect(() => {
    if (!src) {
      setImageLoaded(false);
      return;
    }

    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(false);
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  if (!imageLoaded) {
    return null;
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        onClick={() => setOpen(true)}
        className="image-viewer-trigger"
        aria-label="View image"
        title="View image"
      >
        <Eye size={18} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="image-viewer-overlay" />
        <Dialog.Content className="image-viewer-content">
           <VisuallyHidden.Root><Dialog.Title className="DialogTitle">Preview</Dialog.Title></VisuallyHidden.Root> 
          <Dialog.Close asChild>
            <button className="image-viewer-close" aria-label="Close">
              ✕
            </button>
          </Dialog.Close>
          
            <TransformWrapper
              ref={transformRef}
              initialScale={1}
              minScale={1}
              maxScale={10}
              centerOnInit
              wheel={{ step: 0.1 }}
              panning={{ disabled: false }}
              pinch={{ disabled: false }}
              onTransformed={(instance) => {
                setScale(instance.state.scale);
              }}
            >
              <TransformComponent
                wrapperClass="image-viewer-transform-wrapper"
                contentClass="image-viewer-transform-content"
              >
                <img src={src} alt={alt} className="image-viewer-image" />
              </TransformComponent>
              <div className="image-viewer-controls">
                <Slider
                  value={[scale]}
                  min={1}
                  style={{ width: "100px" }}
                  max={10}
                  step={0.02}
                  onValueChange={([nextScale]) => {
                    if (!transformRef.current) return;
                   if( nextScale > scale ){
                     transformRef.current.zoomIn(0.02, 0);
                   }else{
                     transformRef.current.zoomOut(0.02, 0);
                   }
                  }}
                />
                <div className="image-viewer-zoom-display">Zoom: {scale.toFixed(1)}x</div>
                <Button
                  onClick={() => {
                    if (!transformRef.current) return;
                    transformRef.current.resetTransform();
                    setScale(1);
                  }}
                  variant="outline"
                  size="sm"
                  className="image-viewer-reset-btn"
                >
                  Reset
                </Button>
              </div>
            </TransformWrapper>
          
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

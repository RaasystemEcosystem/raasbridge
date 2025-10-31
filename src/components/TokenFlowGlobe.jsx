// src/components/TokenFlowGlobe.jsx
import React, { useRef, useEffect, useState } from "react";
import Globe from "react-globe.gl";

export default function TokenFlowGlobe({ raasValue, rbtValue, flows }) {
  const containerRef = useRef();
  const globeEl = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Measure container
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Enable auto-rotate
  useEffect(() => {
    if (globeEl.current && globeEl.current.controls) {
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
    }
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {dimensions.width > 0 && dimensions.height > 0 && (
        <Globe
          ref={globeEl}
          width={dimensions.width}
          height={dimensions.height}
          // Use a CDN that works reliably
          globeImageUrl="https://unpkg.com/three-globe/example/img/earth-dark.jpg"
          arcsData={flows}
          arcColor={(d) => d.color}
          arcAltitude={0.2}
          arcStroke={1.5}
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashInitialGap={() => Math.random()}
          arcDashAnimateTime={4000}
          backgroundColor="transparent"
          rendererConfig={{ antialias: true, alpha: true }}
          globeMaterial={{
            bumpScale: 0.05,
            color: "#000000",
            specular: "#555555",
          }}
        />
      )}
    </div>
  );
}


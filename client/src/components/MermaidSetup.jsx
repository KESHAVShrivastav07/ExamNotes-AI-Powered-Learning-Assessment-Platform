import React, { useEffect, useState, useRef } from 'react'
import mermaid from 'mermaid'

function MermaidSetup({ chart }) {

    const mermaidRef = useRef(null)
    const [svgContent, setSvgContent] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        mermaid.initialize({ startOnLoad: true, theme: 'default' })
    }, [])

    useEffect(() => {
        const renderChart = async () => {
            if (!chart) return;
            
            // Task 1.2: Only render if valid (starts with graph/flowchart/etc)
            const cleanChartData = cleanMermaidData(chart);
            const isValidPrefix = /^(graph|flowchart|sequenceDiagram|gantt|classDiagram|stateDiagram|erDiagram|journey|gantt|pie|quadrantChart|requirementDiagram)/i.test(cleanChartData);

            if (!isValidPrefix) {
                console.warn('Invalid Mermaid prefix, skipping render.');
                setError(true);
                return;
            }

            try {
                setError(false);
                const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
                const { svg } = await mermaid.render(id, cleanChartData);
                setSvgContent(svg);
            } catch (err) {
                console.error('Mermaid Render Error:', err);
                setError(true);
                setSvgContent('');
                
                // CRITICAL: Mermaid 10+ injects error UI into the bottom of the body 
                setTimeout(() => {
                    const errorNodes = document.querySelectorAll('div[id^="dmermaid"], .mermaid-error');
                    errorNodes.forEach(node => node.remove());
                }, 50);
            }
        };

        renderChart();
    }, [chart]);

    const cleanMermaidData = (data) => {
        if (typeof data !== 'string') return '';
        let cleanData = data.replace(/```mermaid\n?/g, '').replace(/```/g, '');
        cleanData = cleanData.replace(/\[\/\/\]: # \(.*?\)\n/g, ''); 
        cleanData = cleanData.replace(/"/g, '');
        cleanData = cleanData.replace(/\n\s*\n/g, '\n');
        return cleanData.trim();
    };

    return (
        <div className="w-full overflow-x-auto flex justify-center py-4">
            {error ? (
                // Task 1.3: Display content as plain text instead if syntax is invalid
                <div className="w-full max-w-2xl bg-gray-50 rounded-xl border border-gray-100 p-6">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Diagram Data (Plain Text)</p>
                    <pre className="text-sm text-gray-600 font-mono whitespace-pre-wrap leading-relaxed">
                        {cleanMermaidData(chart)}
                    </pre>
                </div>
            ) : (
                <div
                    ref={mermaidRef}
                    className="mermaid-container transition-opacity duration-300"
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                />
            )}
        </div>
    )
}

export default MermaidSetup

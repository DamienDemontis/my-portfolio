import React, { useEffect, useState } from 'react';
import { startJankMonitor, exportJankLogs } from '../../utils/jankMonitor';
import { auditAnimations, exportAnimationAudit } from '../../utils/animAudit';
import { exportProfilerData } from '../../utils/ProfilerLog';

interface PerformanceMonitorProps {
  enabled?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  enabled = false 
}) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [animationIssues, setAnimationIssues] = useState<any[]>([]);

  useEffect(() => {
    if (!enabled) return;

    let cleanup: (() => void) | undefined;

    if (isMonitoring) {
      cleanup = startJankMonitor();
    }

    return cleanup;
  }, [enabled, isMonitoring]);

  const runAnimationAudit = () => {
    const issues = auditAnimations();
    setAnimationIssues(issues);
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
  };

  if (!enabled) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: '8px',
        left: '8px',
        zIndex: 99999,
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '12px',
        borderRadius: '8px',
        font: '12px monospace',
        maxWidth: '300px'
      }}
    >
      <h3 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>🔧 Performance Monitor</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button 
          onClick={toggleMonitoring}
          style={{ 
            padding: '4px 8px', 
            fontSize: '11px',
            background: isMonitoring ? '#dc2626' : '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isMonitoring ? '⏹️ Stop FPS Monitor' : '▶️ Start FPS Monitor'}
        </button>
        
        <button 
          onClick={runAnimationAudit}
          style={{ 
            padding: '4px 8px', 
            fontSize: '11px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🎭 Audit Animations
        </button>
        
        <div style={{ display: 'flex', gap: '4px' }}>
          <button 
            onClick={exportJankLogs}
            style={{ 
              padding: '4px 6px', 
              fontSize: '10px',
              background: '#7c2d12',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              flex: 1
            }}
          >
            📊 Export FPS
          </button>
          
          <button 
            onClick={exportAnimationAudit}
            style={{ 
              padding: '4px 6px', 
              fontSize: '10px',
              background: '#7c2d12',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              flex: 1
            }}
          >
            📊 Export Anims
          </button>
          
          <button 
            onClick={exportProfilerData}
            style={{ 
              padding: '4px 6px', 
              fontSize: '10px',
              background: '#7c2d12',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              flex: 1
            }}
          >
            📊 Export React
          </button>
        </div>
        
        {animationIssues.length > 0 && (
          <div style={{ 
            marginTop: '8px', 
            padding: '6px', 
            background: 'rgba(220, 38, 38, 0.2)',
            borderRadius: '4px',
            fontSize: '10px'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              ⚠️ Animation Issues: {animationIssues.length}
            </div>
            <div>
              High: {animationIssues.filter(i => i.severity === 'high').length} | 
              Medium: {animationIssues.filter(i => i.severity === 'medium').length} | 
              Low: {animationIssues.filter(i => i.severity === 'low').length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// Properties that cause layout recalculation (expensive)
const layoutProps = new Set([
  "top", "left", "right", "bottom", 
  "width", "height", 
  "margin", "margin-top", "margin-right", "margin-bottom", "margin-left",
  "padding", "padding-top", "padding-right", "padding-bottom", "padding-left",
  "border", "border-width", "border-top", "border-right", "border-bottom", "border-left",
  "inset", "inset-block", "inset-inline"
]);

// Properties that cause paint but not layout (better)
const paintProps = new Set([
  "color", "background", "background-color", "background-image",
  "border-color", "border-radius", "border-style",
  "box-shadow", "text-shadow", "outline", "outline-color"
]);

interface AnimationIssue {
  element: string;
  issue: string;
  severity: 'high' | 'medium' | 'low';
  recommendation: string;
  transitions?: string[];
  animationName?: string;
  className?: string;
}

export function auditAnimations(): AnimationIssue[] {
  const issues: AnimationIssue[] = [];
  
  // Audit all elements
  for (const el of Array.from(document.querySelectorAll<HTMLElement>("*"))) {
    const cs = getComputedStyle(el);
    
    // Safely get className as string
    const classNameStr = el.className?.toString() || '';
    const elementDesc = `${el.tagName.toLowerCase()}${classNameStr ? '.' + classNameStr.split(' ').join('.') : ''}`;
    
    // Check transition properties
    const transitionProps = cs.transitionProperty?.split(",").map(s => s.trim().toLowerCase()) ?? [];
    const layoutTransitions = transitionProps.filter(prop => layoutProps.has(prop));
    const paintTransitions = transitionProps.filter(prop => paintProps.has(prop));
    
    if (layoutTransitions.length > 0) {
      issues.push({
        element: elementDesc,
        issue: "Layout-thrashing transitions detected",
        severity: 'high',
        recommendation: "Use transform and opacity instead of layout properties",
        transitions: layoutTransitions,
        className: classNameStr
      });
    }
    
    if (paintTransitions.length > 0) {
      issues.push({
        element: elementDesc,
        issue: "Paint-heavy transitions detected",
        severity: 'medium',
        recommendation: "Consider using transform/opacity for better performance",
        transitions: paintTransitions,
        className: classNameStr
      });
    }
    
    // Check animation names
    const animationName = cs.animationName;
    if (animationName && animationName !== "none") {
      issues.push({
        element: elementDesc,
        issue: "CSS animation detected",
        severity: 'medium',
        recommendation: "Check keyframes for layout-changing properties",
        animationName: animationName,
        className: classNameStr
      });
    }
    
    // Check for expensive filters
    const filter = cs.filter;
    if (filter && filter !== "none") {
      const hasBlur = filter.includes("blur");
      const hasDropShadow = filter.includes("drop-shadow");
      
      if (hasBlur || hasDropShadow) {
        issues.push({
          element: elementDesc,
          issue: "Expensive filter detected",
          severity: hasBlur ? 'high' : 'medium',
          recommendation: hasBlur 
            ? "Blur filters are very expensive - consider alternatives" 
            : "Drop-shadow filters can be expensive - use box-shadow if possible",
          className: classNameStr
        });
      }
    }
    
    // Check for will-change usage
    const willChange = cs.willChange;
    if (willChange && willChange !== "auto") {
      if (willChange === "transform" || willChange === "opacity") {
        // Good usage
      } else {
        issues.push({
          element: elementDesc,
          issue: "Potentially problematic will-change usage",
          severity: 'low',
          recommendation: "will-change should typically only use 'transform' or 'opacity'",
          className: classNameStr
        });
      }
    }
  }
  
  // Store results globally for export
  (window as any).__ANIM_AUDIT__ = issues;
  
  // Log results
  console.group("🎭 Animation Audit Results");
  console.table(issues);
  console.groupEnd();
  
  return issues;
}

// Export function for debugging
export const exportAnimationAudit = () => {
  const data = auditAnimations();
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "animation-audit.json";
  a.click();
  URL.revokeObjectURL(url);
};

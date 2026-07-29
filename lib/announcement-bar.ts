export interface AnnouncementBarOptions {
  bg?: string;
  height?: string;
  fontSize?: string;
  letterSpacing?: string;
  gap?: string;
  speed?: string;
  containerElement?: HTMLElement | null;
}

/**
 * Reusable initialization function for the premium eCommerce announcement bar marquee.
 * 
 * @param trackElement - The element inside the bar that acts as the sliding marquee track
 * @param messagesArray - List of announcements to loop through
 * @param options - Custom override styles (bg, height, speed, etc.)
 */
export function initAnnouncementBar(
  trackElement: HTMLElement,
  messagesArray: string[],
  options: AnnouncementBarOptions = {}
): void {
  if (!trackElement || !Array.isArray(messagesArray) || messagesArray.length === 0) {
    console.error("Invalid arguments passed to initAnnouncementBar");
    return;
  }

  // Find the container element to apply local CSS custom property overrides
  const container = options.containerElement || trackElement.closest(".announcement-bar") || trackElement;

  if (container instanceof HTMLElement) {
    if (options.bg) container.style.setProperty("--bar-bg", options.bg);
    if (options.height) {
      container.style.setProperty("--bar-height", options.height);
      // Synchronize the global CSS height variable so other components adjust spacing
      document.documentElement.style.setProperty("--announcement-bar-height", options.height);
    }
    if (options.fontSize) container.style.setProperty("--bar-font-size", options.fontSize);
    if (options.letterSpacing) container.style.setProperty("--bar-letter-spacing", options.letterSpacing);
    if (options.gap) container.style.setProperty("--bar-gap", options.gap);
    if (options.speed) container.style.setProperty("--bar-speed", options.speed);
  }

  // Clear existing content in the track
  trackElement.innerHTML = "";

  // Helper function to build a single message group
  const createGroup = (): HTMLDivElement => {
    const group = document.createElement("div");
    group.className = "announcement-bar__group";

    messagesArray.forEach((message) => {
      const item = document.createElement("span");
      item.className = "announcement-bar__item";
      item.innerHTML = message;
      group.appendChild(item);

      // Append standard separator dot.
      // This is crucial for spacing: by keeping a separator after every item,
      // the gap between the last item of group 1 and first item of group 2
      // matches the gap between any other two items.
      const separator = document.createElement("span");
      separator.className = "announcement-bar__separator";
      separator.textContent = "•";
      group.appendChild(separator);
    });

    return group;
  };

  // Build the first group
  const group1 = createGroup();

  // Clone it exactly to create Group 2 for the seamless loop transition.
  // When animating the double-width track from translateX(0) to translateX(-50%),
  // Group 2 aligns perfectly pixel-by-pixel with Group 1's starting position.
  // Re-starting the animation at 0% is completely imperceptible to the user.
  const group2 = group1.cloneNode(true) as HTMLDivElement;

  trackElement.appendChild(group1);
  trackElement.appendChild(group2);
}

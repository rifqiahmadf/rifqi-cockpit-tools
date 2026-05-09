/**
 * Browser-compatible shim for @tauri-apps/api/dpi
 */

/**
 * Represents a logical size with width and height
 */
export class LogicalSize {
  public width: number;
  public height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  /**
   * Convert to a plain object
   */
  toJSON(): { width: number; height: number } {
    return {
      width: this.width,
      height: this.height,
    };
  }
}

/**
 * Represents a physical size with width and height
 */
export class PhysicalSize {
  public width: number;
  public height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  /**
   * Convert to logical size based on scale factor
   */
  toLogical(scaleFactor: number): LogicalSize {
    return new LogicalSize(
      this.width / scaleFactor,
      this.height / scaleFactor
    );
  }

  /**
   * Convert to a plain object
   */
  toJSON(): { width: number; height: number } {
    return {
      width: this.width,
      height: this.height,
    };
  }
}

/**
 * Represents a logical position with x and y
 */
export class LogicalPosition {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toJSON(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }
}

/**
 * Represents a physical position with x and y
 */
export class PhysicalPosition {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Convert to logical position based on scale factor
   */
  toLogical(scaleFactor: number): LogicalPosition {
    return new LogicalPosition(
      this.x / scaleFactor,
      this.y / scaleFactor
    );
  }

  toJSON(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }
}

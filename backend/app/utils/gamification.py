"""
Gamification Utilities
======================
Centralized module for XP, level, streak, and focus point calculations.
All gamification logic should be imported from here to avoid duplication.
"""
from datetime import datetime, date

# =============================================================================
# Constants
# =============================================================================
FOCUS_CAP = 5
XP_EXPONENT = 1.2
XP_BASE = 100


# =============================================================================
# XP and Level Functions
# =============================================================================
def xp_for_next_level(level: int) -> int:
    """
    Calculate XP required to complete a given level.
    Formula: 100 * level^1.2 (soft exponential curve)
    """
    return int(XP_BASE * (level ** XP_EXPONENT))


def level_from_xp(xp: int) -> int:
    """
    Calculate level based on total XP.
    Iterates through levels until XP is exhausted.
    """
    level = 1
    remaining = xp
    while remaining >= xp_for_next_level(level):
        remaining -= xp_for_next_level(level)
        level += 1
    return level


def next_level_requirement(xp: int) -> int:
    """Calculate XP required to complete the current level."""
    level = level_from_xp(xp)
    return xp_for_next_level(level)


def cumulative_xp_to_level(level: int) -> int:
    """Calculate total XP required to reach a given level from level 1."""
    if level <= 1:
        return 0
    total = 0
    for i in range(1, level):
        total += xp_for_next_level(i)
    return total


# =============================================================================
# Focus Points Functions
# =============================================================================
def refresh_focus_points(user, focus_cap: int = FOCUS_CAP) -> None:
    """
    Refresh focus points once per day.
    Modifies the user object in place.
    
    Args:
        user: User model instance with focus_points and focus_refreshed_at attributes
        focus_cap: Maximum focus points (default: 5)
    """
    today = date.today()
    if not user.focus_refreshed_at or user.focus_refreshed_at.date() < today:
        user.focus_points = focus_cap
        user.focus_refreshed_at = datetime.utcnow()


# =============================================================================
# Streak Functions
# =============================================================================
def update_streak(user) -> None:
    """
    Update user streak based on last_checkin_at.
    Modifies the user object in place.
    
    - If last check-in was yesterday: increment streak
    - If last check-in was today: no change
    - Otherwise: reset streak to 1
    
    Args:
        user: User model instance with streak, best_streak, and last_checkin_at attributes
    """
    today = date.today()
    if user.last_checkin_at:
        last = user.last_checkin_at.date()
        if last == today:
            return  # Already checked in today
        if (today - last).days == 1:
            user.streak += 1
        else:
            user.streak = 1  # Streak broken
    else:
        user.streak = 1  # First check-in

    user.best_streak = max(user.best_streak, user.streak)
    user.last_checkin_at = datetime.utcnow()


def check_penalty(user) -> None:
    """
    Check if user missed a day and apply penalty.
    Uses streak freeze if available, otherwise deducts hearts.
    Modifies the user object in place.
    
    Args:
        user: User model instance with hearts, streak, streak_freeze_count,
              last_checkin_at, and last_heart_loss attributes
    """
    today = date.today()
    
    # If never checked in, no penalty yet (grace period)
    if not user.last_checkin_at:
        return

    last_checkin_date = user.last_checkin_at.date()
    days_since_checkin = (today - last_checkin_date).days

    # If missed more than 1 day (yesterday), apply penalty
    if days_since_checkin > 1:
        # Only penalize once per inactive period:
        # If last_heart_loss occurred AFTER last_checkin_at, we already penalized
        if user.last_heart_loss and user.last_heart_loss >= user.last_checkin_at:
            return

        # Check if user has a streak freeze to consume
        if user.streak_freeze_count > 0:
            user.streak_freeze_count -= 1
            # Mark penalty time to prevent multiple freeze consumptions
            user.last_heart_loss = datetime.utcnow()
            return

        # No streak freeze available - apply full penalty
        if user.hearts > 0:
            user.hearts -= 1
            user.last_heart_loss = datetime.utcnow()
            # Reset streak on penalty
            user.streak = 0

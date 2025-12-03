
def level_from_xp(xp: int) -> int:
    """
    Calculate level based on XP.
    Formula: Level L requires 100 * L^1.2 XP
    """
    level = 1
    remaining = xp
    while remaining >= int(100 * (level ** 1.2)):
        remaining -= int(100 * (level ** 1.2))
        level += 1
    return level

def xp_for_next_level(level: int) -> int:
    """Calculate XP required to complete the current level."""
    return int(100 * (level ** 1.2))

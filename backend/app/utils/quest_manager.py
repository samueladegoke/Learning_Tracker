"""
Helper function to assign next quest when current one is completed.
"""
from sqlalchemy.orm import Session
from app.models import Quest, UserQuest, User
from datetime import datetime


def assign_next_quest(db: Session, user_id: int) -> UserQuest | None:
    """
    Assign the next available quest to a user.
    Returns the new UserQuest if assigned, None if no more quests.
    """
    # Get all quests the user has completed
    completed_quest_ids = [
        uq.quest_id 
        for uq in db.query(UserQuest).filter(
            UserQuest.user_id == user_id,
            UserQuest.completed_at.isnot(None)
        ).all()
    ]
    
    # Find the first quest not yet completed
    query = db.query(Quest)
    if completed_quest_ids:
        query = query.filter(Quest.id.notin_(completed_quest_ids))
    
    next_quest = query.order_by(Quest.id).first()
    
    if not next_quest:
        return None
    
    # Create new UserQuest
    new_user_quest = UserQuest(
        user_id=user_id,
        quest_id=next_quest.id,
        boss_hp_remaining=next_quest.boss_hp,
    )
    db.add(new_user_quest)
    db.flush()
    
    return new_user_quest

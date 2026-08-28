import asyncio
import subprocess

import typer

from app.console import console
from app.db import SessionLocal
from app.queries.users import get_by_email

app = typer.Typer()


@app.command()
def seed(force: bool = False):
    """Seed the database with initial data."""
    if force:
        console.print("Seeding...")
        with open("./seed_dev.sql") as f:
            subprocess.run(
                [
                    "docker",
                    "compose",
                    "exec",
                    "-T",
                    "db",
                    "psql",
                    "-U",
                    "devio",
                    "-d",
                    "devio",
                ],
                stdin=f,
                check=True,
            )

    console.print("Done")


@app.command()
def make_admin(email: str):
    """Create an admin user."""
    console.print("Making admin...")
    asyncio.run(_make_admin(email))
    console.print("Done")


async def _make_admin(email: str):
    async with SessionLocal() as db:
        user = await get_by_email(db, email)

        if user is None:
            console.print("User not found")
            return None

        user.role = "admin"
        await db.commit()
        return user


if __name__ == "__main__":
    app()

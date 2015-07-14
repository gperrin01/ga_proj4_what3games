class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many  :answers

  attr_accessor :score

  def update_score (points)
    self['score'] += points
    self.save
    # self.update(score: score + points)
  end

  def global_ranking
    User.order('score DESC').index(self) + 1
  end


end
